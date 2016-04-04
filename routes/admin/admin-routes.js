import express from 'express';
import { ensureAuthenticated, addGenericAuthenticatedRenderData } from '../../middleware/authentication/ensureAuthentication.js';
import Admin from '../../frontend-app/admin-app/Admin.js';
import { getBaseUrl } from '../helpers/route-helpers.js';
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import config from '../../config.json';

var router = express.Router();

router.get('/',
    ensureAuthenticated,
    addGenericAuthenticatedRenderData,
    renderAdminPage
);

function renderAdminPage(req, res, next) {
    if (!req.userObject || !req.userObject.isAdmin) {
        return next();
    }

    var props = {
        baseUrl: getBaseUrl(req)
    };

    req.renderData.react = {
        renderedApp: ReactDOMServer.renderToString(React.createFactory(Admin)(props)),
        bundle: config.react.htmlDir + config.react.components.admin.bundle,
        initProps: props
    };

    return res.render('admin-homepage', req.renderData)
}

export default router;