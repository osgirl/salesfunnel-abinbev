import Registration from '../model/registration/registration-schema.js';
import { getStartOfWeekDate, getEndOfWeekDate, getWeekNumber, getFromCurrentDate, getToCurrentDate } from './period-service.js';
import _ from 'lodash';
import moment from 'moment';

export function getWorkWeekUserRegistrationData(userId, nrOfWeeks) {
    var registrationByUserRefPromises = doGetWorkWeekUserRegistrationData();

    return Promise.all(registrationByUserRefPromises).
        then(function (result) {
            return Promise.resolve(result);
        }).catch(function (err) {
            console.log("error!: " + err)
        });

    function doGetWorkWeekUserRegistrationData() {
        var registrationByUserRefPromises = [];
        for (var i = 0; i < nrOfWeeks; i++) {
            registrationByUserRefPromises.push(getWorkWeekRegistrationData(i, userId));
        }
        return registrationByUserRefPromises;
    }

    function getWorkWeekRegistrationData(nrOfWeeksInThePast, userId) {
        var fromDate = getStartOfWeekDate(nrOfWeeksInThePast);
        var toDate = getEndOfWeekDate(nrOfWeeksInThePast);
        var weekNumber = getWeekNumber(nrOfWeeksInThePast);

        console.log(`getWorkWeekRegistratrionData - from, to:${nrOfWeeksInThePast} from ${fromDate.toDate()} to ${toDate.toDate()}`);
        return getRegistrationsByUserRef(userId, fromDate, toDate)
            .then(calculateAndResolveRegistrationData)
            .then(function (result) {
                var workWeekVisits = {
                    period: weekNumber,
                    nrOfVisits: result.visits,
                    nrOfDeals: result.deals
                };

                return Promise.resolve(workWeekVisits);
            });
    }
}
export function getCalculatedTeamRegistrationData(teamId, periodData) {
    var fromDate = periodData.fromDate;
    var toDate = periodData.toDate;

    var promise = (teamId !== "NA") ? getRegistrationsByTeamRef(teamId, fromDate, toDate) : getRegistrations(fromDate, toDate);

    return promise
        .then(calculateAndResolveRegistrationData);
}

export function getCalculatedUserRegistrationData(userId, periodData) {
    var fromDate = periodData.fromDate;
    var toDate = periodData.toDate;
    return getRegistrationsByUserRef(userId, fromDate, toDate)
        .then(calculateAndResolveRegistrationData)
        .catch((err) => {
            console.log("getCalculatedUserRegistrationData error: " + err);
            throw err;
        });
}

export function saveRegistration(userId, teamId, date, registrationData) {
    var query = {
        userRef: userId,
        date: {$gte: getFromCurrentDate(moment(date)).toDate(), $lte: getToCurrentDate(moment(date)).toDate()}
    };

    var registration = {
        userRef: userId,
        teamRef: teamId,
        date: date,
        visits: registrationData.visits,
        negos: registrationData.negos,
        proposals: registrationData.proposals,
        deals: registrationData.deals,
        updated: new Date()
    };

    return new Promise(function (resolve, reject) {
        Registration.findOneAndUpdate(query, registration, {upsert: true}, function (err, persistedRegistration) {
            if (err) return reject(err);
            return resolve(persistedRegistration)
        })
    })
}

function getRegistrations(fromDate, toDate) {
    return new Promise(function (resolve, reject) {
        Registration.find({
            date: {$gte: fromDate.toDate(), $lte: toDate.toDate()}
        }, (err, registrations) => {
            if (err) return reject(err);
            return resolve(registrations);
        });
    });
}

function getRegistrationsByTeamRef(teamRef, fromDate, toDate) {
    return new Promise(function (resolve, reject) {
        Registration.find({
            teamRef: teamRef,
            date: {$gte: fromDate.toDate(), $lte: toDate.toDate()}
        }, (err, registrations) => {
            if (err) return reject(err);
            return resolve(registrations);
        });
    });
}

function getRegistrationsByUserRef(userRef, fromDate, toDate) {
    return new Promise(function (resolve, reject) {
        Registration.find({
            userRef: userRef,
            date: {$gte: fromDate.toDate(), $lte: toDate.toDate()}
        }, (err, registrations) => {
            if (err) return reject(err);
            return resolve(registrations);
        });
    });
}

function calculateAndResolveRegistrationData(result) {
    return new Promise(function (resolve, reject) {
        return resolve(calculateRegistrationData(result))
    });

    function calculateRegistrationData(result) {
        var totalVisits = 0;
        var totalProposals = 0;
        var totalNegos = 0;
        var totalDeals = 0;

        _(result).forEach(function (registration) {
            totalVisits = totalVisits + registration.visits;
            totalProposals = totalProposals + registration.proposals;
            totalNegos = totalNegos + registration.negos;
            totalDeals = totalDeals + registration.deals;
        });

        return {
            visits: totalVisits,
            proposals: totalProposals,
            negos: totalNegos,
            deals: totalDeals
        }
    }
}