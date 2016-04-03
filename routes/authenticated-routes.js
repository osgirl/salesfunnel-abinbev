import express from 'express';
import config from '../config.json';
import { getAuthenticatedUser } from '../middleware/passport/passport-middleware.js';
import { ensureAuthenticated } from '../middleware/authentication/ensureAuthentication.js';
import { getResendEmailUrl } from './signup/signup.js';
import { getRep, getNationalSalesManager } from '../model/roles/role-fixture.js';
import { getBaseUrl } from './helpers/route-helpers.js';
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import Registration from '../frontend-app/registration-app/Registration.js';
import Salesfunnel from '../frontend-app/salesfunnel-app/Salesfunnel.js';
import { getCalculatedTeamRegistrationData} from '../services/registration-service.js';
import { getTeams, getTeamById } from '../services/team-service.js';
import UserService from '../services/user-service.js';
import { getPeriods, DEFAULT_PERIOD } from '../services/period-service.js';
import { Promise } from 'bluebird';
import { getVisitReport } from '../middleware/registration/visit-reports.js';
import SearchableUser from '../model/users/searchable-user.js';

var router = express.Router();

/* GET home page. */
router.get('/',
    ensureAuthenticated,
    getAuthenticatedUserObject,
    renderUnverifiedWelcomePage,
    getVisitReport,
    renderM1Page,
    renderManagementPage
);

function getAuthenticatedUserObject(req, res, next) {
    getAuthenticatedUser(req.user.id)
        .then(function (userObject) {

            req.userObject = userObject;

            var frontendUser = {
                userName: userObject.userName,
                email: userObject.email
            };

            var error = req.query.error;
            var info = req.query.info;

            req.renderData = {
                metaData: {
                    title: 'Sales funnel - reporting tool - AB Inbev',
                    description: 'This is a reporting tool by and from AB Inbev to report about sales prospects'
                },
                isAuthenticated: true,
                isAdmin: userObject.isAdmin,
                content: {
                    error: error,
                    info: info,
                    user: frontendUser
                }
            };

            next();
        })
        .catch(function (err) {
            next(err);
        });
}

function renderUnverifiedWelcomePage(req, res, next) {
    if (!req.userObject || req.userObject.isVerified) {
        return next();
    }

    req.renderData.content['resendEmailUrl'] = getResendEmailUrl(req.userObject._id);

    res.render('unverified-homepage', req.renderData);
}

function renderM1Page(req, res, next) {
    if (req.userObject.roleRef !== getRep()._id) {
        return next();
    }

    var props = {
        baseUrl: getBaseUrl(req),
        visitReport: res.visitReport
    };

    req.renderData.react = {
        renderedApp: ReactDOMServer.renderToString(React.createFactory(Registration)(props)),
        bundle: config.react.htmlDir + config.react.components.registration.bundle,
        initProps: props
    };

    res.render('registration-homepage', req.renderData)
}

function renderManagementPage(req, res, next) {
    if (req.userObject.roleRef === getRep()._id) {
        return next();
    }

    var header = "Consult the sales graphs of all teams";
    var teamRef = req.userObject.teamRef;
    var teamCall = getTeams;
    var periodRef = DEFAULT_PERIOD._id;
    var periodData = {
        fromDate: DEFAULT_PERIOD.getFromDate(),
        toDate: DEFAULT_PERIOD.getToDate()
    };
    Promise.all([teamCall(), getCalculatedTeamRegistrationData(teamRef, periodData), getPeriods(), UserService.getSearchableUsers(teamRef)])
        .then(function (results) {
            doRenderManagementPage(results[0], results[1], results[2], results[3]);
        })
        .catch(function (err) {
            console.log("Unable to retrieve registration data: " + JSON.stringify(err));
            //TODO how to handle this error?
            return res.status('400').send("Unable to retrieve the data");
        });

    function doRenderManagementPage(teams, data, periods, users) {
        function calculateNoData() {
            if (data.visits === 0) return true;
            return false;
        }

        var props = {
            baseUrl: getBaseUrl(req),
            data: data,
            header: header,
            noData: calculateNoData(),
            teamData: {
                teamRef: teamRef,
                teams: teams
            },
            periodData: {
                periodRef: periodRef,
                periods: periods
            },
            userData: {
                users: users
            }
        };

        try {
            var salesRegistrationFactory = React.createFactory(Salesfunnel)(props);
            var salesRegistrationApp = ReactDOMServer.renderToString(salesRegistrationFactory);
        } catch (err) {
            console.log("Unable to render React component: " + JSON.stringify(err));
            //TODO how to handle this error?
            return res.status('400').send("Unable to retrieve the data");
        }

        req.renderData.react = {
            renderedApp: salesRegistrationApp,
            bundle: config.react.htmlDir + config.react.components.salesfunnel.bundle,
            initProps: props
        };

        return res.render('salesfunnel-homepage', req.renderData)
    }
}

export default router;