import express from 'express';
import { Promise } from 'bluebird';
import { ensureAuthenticated } from '../../middleware/authentication/ensureAuthentication.js';
import { getCalculatedTeamRegistrationData, getCalculatedUserRegistrationData} from '../../services/registration-service.js';
import { getPeriods, getPeriodById, DEFAULT_PERIOD } from '../../services/period-service.js';
import { getAuthenticatedUser } from '../../middleware/passport/passport-middleware.js';
import { getTeamById } from '../../services/team-service.js';
import SearchableUser from '../../model/users/searchable-user.js';

var router = express.Router();

router.get('/teams/:teamRef/:periodRef',
    ensureAuthenticated,
    getTeamSalesfunnelData);

router.get('/users/:userRef/:periodRef',
    ensureAuthenticated,
    getUserSalesfunnelData);

router.get('/',
    ensureAuthenticated,
    getSalesfunnelData);

function getTeamSalesfunnelData(req, res, next) {
    getPeriodById(req.params.periodRef)
        .then(function (period) {
            var periodData = {
                fromDate: period.getFromDate(),
                toDate: period.getToDate()
            };
            getCalculatedTeamRegistrationData(req.params.teamRef, periodData)
                .then(function (results) {
                    res.status('200').send(results);
                })
                .catch(function (err) {
                    console.log("Unable to retrieve registration data: " + JSON.stringify(err));
                    //TODO how to handle this error?
                    return res.status('400').send("Unable to retrieve the data");
                });
        }).catch(function (err) {
            console.log("Unable to retrieve period data: " + JSON.stringify(err));
            //TODO how to handle this error?
            return res.status('400').send("Unable to retrieve the data");
        });
}

function getUserSalesfunnelData(req, res, next) {
    getPeriodById(req.params.periodRef)
        .then(function (period) {
            var periodData = {
                fromDate: period.getFromDate(),
                toDate: period.getToDate()
            };

            getCalculatedUserRegistrationData(req.params.userRef, periodData)
                .then(function (results) {
                    res.status('200').send(results);
                })
                .catch(function (err) {
                    console.log("Unable to retrieve registration data: " + JSON.stringify(err));
                    //TODO how to handle this error?
                    return res.status('400').send("Unable to retrieve the data");
                });
        }).catch(function (err) {
            console.log("Unable to retrieve period data: " + JSON.stringify(err));
            //TODO how to handle this error?
            return res.status('400').send("Unable to retrieve the data");
        });
}

function getSalesfunnelData(req, res, next) {
    var teamCall = function () {
        return getTeamById(req.user.teamRef).then(result => {
            return [result];
        });
    };

    Promise.all([teamCall(), getPeriods(), getAuthenticatedUser(req.user.id)])
        .then((results) => {
            res.status('200').send(createResponseObject(results[0],results[1],results[2]));

            function createResponseObject(teams, periods, userObject) {
                var searchableUser = new SearchableUser(userObject);
                return {
                    userData: {
                        users: [searchableUser]
                    },
                    periodData: {
                        periods: periods,
                        periodRef: DEFAULT_PERIOD._id
                    },
                    teamData: {
                        teamRef: userObject.teamRef,
                        teams: teams
                    }
                };
            }

        })
        .catch(function (err) {
            console.log("Unable to retrieve registration data: " + JSON.stringify(err));
            //TODO how to handle this error?
            return res.status('400').send("Unable to retrieve the data");
        });
}

export default router;