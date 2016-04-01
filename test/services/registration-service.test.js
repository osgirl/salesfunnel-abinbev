import { expect, assert } from 'chai';
import { check, checkAndContinue } from '../helpers/chai-helpers.js';
import moment from 'moment';
import { fillDbBeforeWithRegistrationData, fillDbBefore } from '../helpers/db-helpers.js';
import { DEFAULT_USER, startOfWeekRegistration, startOfWeekPlusOneRegistration, startOfWeekRegistrationOtherUser, lastMonthRegistration } from '../../model/registration/registration-fixture.js';
import { getWorkWeekUserRegistrationData, getCalculatedTeamRegistrationData, getCalculatedUserRegistrationData, saveRegistration } from '../../services/registration-service.js';

describe(`getWorkWeekUserRegistrationData`, function () {
    fillDbBeforeWithRegistrationData();

    it(`returns an object with weekNumber, visits and deals of the week`, function (done) {
        getWorkWeekUserRegistrationData(DEFAULT_USER._id, 2)
            .then(registrationData => {
                check(done, function () {
                    expect(registrationData.length).to.be.at.least(2);
                    var thisWeekRegistrations = registrationData[0];
                    expect(thisWeekRegistrations.nrOfDeals).to.be.at.least(startOfWeekRegistration.deals + startOfWeekPlusOneRegistration.deals);
                    expect(thisWeekRegistrations.nrOfVisits).to.be.at.least(startOfWeekRegistration.visits + startOfWeekPlusOneRegistration.visits);
                    expect(thisWeekRegistrations.period).to.be.at.least(moment().isoWeek());
                });
            })


    });
});

describe(`getCalculatedTeamRegistrationData`, function () {
    var periodData = {
        fromDate: moment().startOf('isoWeek'),
        toDate: moment().endOf('isoWeek')
    };

    fillDbBeforeWithRegistrationData();

    it(`returns salesfunnel data of a team for a certain period`, function (done) {
        getCalculatedTeamRegistrationData(DEFAULT_USER.teamRef, periodData)
            .then(registrationData => {
                check(done, function () {
                    expect(registrationData.deals).to.be.at.least(startOfWeekRegistration.deals + startOfWeekPlusOneRegistration.deals);
                    expect(registrationData.proposals).to.be.at.least(startOfWeekRegistration.proposals + startOfWeekPlusOneRegistration.proposals);
                    expect(registrationData.negos).to.be.at.least(startOfWeekRegistration.negos + startOfWeekPlusOneRegistration.negos);
                    expect(registrationData.visits).to.be.at.least(startOfWeekRegistration.visits + startOfWeekPlusOneRegistration.visits);
                });
            })
    });

    it(`when teamId == NA then it returns salesfunnel data of all teams for a certain period`, function (done) {
        getCalculatedTeamRegistrationData("NA", periodData)
            .then(registrationData => {
                check(done, function () {
                    expect(registrationData.deals).to.be.at.least(startOfWeekRegistration.deals + startOfWeekPlusOneRegistration.deals + startOfWeekRegistrationOtherUser.deals);
                    expect(registrationData.proposals).to.be.at.least(startOfWeekRegistration.proposals + startOfWeekPlusOneRegistration.proposals + startOfWeekRegistrationOtherUser.proposals);
                    expect(registrationData.negos).to.be.at.least(startOfWeekRegistration.negos + startOfWeekPlusOneRegistration.negos + startOfWeekRegistrationOtherUser.negos);
                    expect(registrationData.visits).to.be.at.least(startOfWeekRegistration.visits + startOfWeekPlusOneRegistration.visits + startOfWeekRegistrationOtherUser.visits);
                });
            })
    });
});

describe(`getCalculatedUserRegistrationData`, function () {
    var periodData = {
        fromDate: moment().startOf('month').subtract(1, 'month'),
        toDate: moment().endOf('month').subtract(1, 'month')
    };

    fillDbBeforeWithRegistrationData();

    it(`returns salesfunnel data of a user for a certain period`, function (done) {
        getCalculatedUserRegistrationData(DEFAULT_USER._id, periodData)
            .then(registrationData => {
                check(done, function () {
                    expect(registrationData.deals).to.be.at.least(lastMonthRegistration.deals);
                    expect(registrationData.proposals).to.be.at.least(lastMonthRegistration.proposals);
                    expect(registrationData.negos).to.be.at.least(lastMonthRegistration.negos);
                    expect(registrationData.visits).to.be.at.least(lastMonthRegistration.visits);
                });
            })
    });
});

describe(`saveRegistration`, function () {
    fillDbBefore();

    it(`persists a new registration`, function (done) {
        getWorkWeekUserRegistrationData(DEFAULT_USER._id, 1)
            .then(registrationData => {
                checkAndContinue(done, function () {
                    expect(registrationData[0].nrOfDeals).to.equal(0);
                    saveRegistration(DEFAULT_USER._id, DEFAULT_USER.teamRef, moment().toDate(), {
                        visits: 5,
                        proposals: 4,
                        negos: 3,
                        deals: 2
                    })
                        .then(() => {
                            getWorkWeekUserRegistrationData(DEFAULT_USER._id, 1)
                                .then(registrationData => {
                                    check(done, function () {
                                        expect(registrationData[0].nrOfDeals).to.equal(2);
                                    });
                                })
                        })

                });
            })
    });
});