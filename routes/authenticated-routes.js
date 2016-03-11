import express from 'express';
import config from '../config.json';
import { getAuthenticatedUser } from '../middleware/passport/passport-middleware.js';
import { ensureAuthenticated } from '../middleware/authentication/ensureAuthentication.js';
import { getResendEmailUrl } from './signup/signup.js';
import { getRep } from '../model/roles/role-fixture.js';
import { getBaseUrl } from './helpers/route-helpers.js';
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import Registration from '../frontend-app/registration-app/Registration.js';
var router = express.Router();

/* GET home page. */
router.get('/',
    ensureAuthenticated,
    getAuthenticatedUserObject,
    renderUnverifiedWelcomePage,
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
        user: req.renderData.content.user,
        baseUrl: getBaseUrl(req)
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

    res.render('salesfunnel-homepage', req.renderData)
}

export default router;