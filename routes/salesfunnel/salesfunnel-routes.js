import express from 'express';
import { Promise } from 'bluebird';
import { ensureAuthenticated, addGenericAuthenticatedRenderData } from '../../middleware/authentication/ensureAuthentication.js';
import { getCalculatedTeamRegistrationData, getCalculatedUserRegistrationData} from '../../services/registration-service.js';
import { getPeriods, getPeriodById, DEFAULT_PERIOD } from '../../services/period-service.js';
import { getTeamById } from '../../services/team-service.js';
import SearchableUser from '../../model/users/searchable-user.js';
import { getBaseUrl } from '../helpers/route-helpers.js';
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import config from '../../config.json';
import Salesfunnel from '../../frontend-app/salesfunnel-app/Salesfunnel.js';

var router = express.Router();

router.get('/teams/:teamRef/:periodRef',
    ensureAuthenticated,
    getTeamSalesfunnelData);

router.get('/users/:userRef/:periodRef',
    ensureAuthenticated,
    getUserSalesfunnelData);

router.get('/',
    ensureAuthenticated,
    addGenericAuthenticatedRenderData,
    getSalesfunnelData,
    renderSalesfunnel);

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
            return result;
        });
    };

    Promise.all([teamCall(), getPeriods()])
        .then((results) => {
            return createResponseObject(results[0], results[1]);

            function createResponseObject(team, periods) {
                var teams = {};
                teams[team.id] = team;
                var searchableUser = new SearchableUser(req.userObject);
                req.salesfunnelProps = {
                    header: "Consult your own sales graphs",
                    baseUrl: getBaseUrl(req),

                    userData: {
                        userRef: searchableUser.id,
                        users: [searchableUser]
                    },
                    periodData: {
                        periods: periods,
                        periodRef: DEFAULT_PERIOD._id
                    },
                    teamData: {
                        teamRef: req.userObject.teamRef,
                        teams: teams
                    }
                };
                return next();
            }

        })
        .catch(function (err) {
            console.log("Unable to retrieve registration data: " + JSON.stringify(err));
            //TODO how to handle this error?
            return res.status('400').send("Unable to retrieve the data");
        });
}

function renderSalesfunnel(req, res, next) {
    req.renderData.react = {
        renderedApp: ReactDOMServer.renderToString(React.createFactory(Salesfunnel)(req.salesfunnelProps)),
        bundle: config.react.htmlDir + config.react.components.salesfunnel.bundle,
        initProps: req.salesfunnelProps
    };

    return res.render('salesfunnel-homepage', req.renderData)
}

export default router;