import Registration from '../model/registration/registration-schema.js';
import _ from 'lodash';


export function getRegistrations() {
    return new Promise(function (resolve, reject) {
        Registration.find({}, (err, registrations) => {
            if (err) return reject(err);
            return resolve(registrations);
        });
    });
}

export function getRegistrationsByTeamRef(teamRef) {
    return new Promise(function (resolve, reject) {
        Registration.find({teamRef: teamRef}, (err, registrations) => {
            if (err) return reject(err);
            return resolve(registrations);
        });
    });
}

export function getCalculatedRegistrationData(teamId) {
    var promise = (teamId !== "NA") ? getRegistrationsByTeamRef(teamId) : getRegistrations();

    return promise
        .then(function (result) {
            var totalVisits = 0;
            var totalProposals = 0;
            var totalNegos = 0;
            var totalDeals = 0;

            _(result).forEach(function (registration) {
                totalVisits = totalVisits + registration.visits;
                totalProposals = totalProposals  + registration.proposals;
                totalNegos = totalNegos + registration.negos;
                totalDeals = totalDeals + registration.deals;
            });

            return new Promise(function(resolve, reject) {
                return resolve({
                    visits: totalVisits,
                    proposals: totalProposals,
                    negos: totalNegos,
                    deals: totalDeals
                })
            })
        })
        ;
}

export function saveRegistration(userId, teamId, date, registrationData) {
    var query = {
        userRef: userId,
        date: date
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