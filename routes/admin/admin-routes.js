import express from 'express';
import { ensureAuthenticated, addGenericAuthenticatedRenderData } from '../../middleware/authentication/ensureAuthentication.js';
import Admin from '../../frontend-app/admin-app/Admin.js';
import { getBaseUrl } from '../helpers/route-helpers.js';
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import config from '../../config.json';
import UserService from '../../services/user-service.js';
import { getRolesMappedById } from '../../services/role-service.js';
import { getTeamsMappedById } from '../../services/team-service.js';
import AdminUser from '../../model/users/admin-user.js';
import { Promise } from 'bluebird';

var router = express.Router();

router.get('/',
    ensureAuthenticated,
    ensureIsAdmin,
    addGenericAuthenticatedRenderData,
    getAdminPageProps,
    renderAdminPage
);

router.put('/users/:userId',
    ensureAuthenticated,
    ensureIsAdmin,
    updateUser);

router.get('/users',
    ensureAuthenticated,
    ensureIsAdmin,
    getAdminPageProps,
    getUsers);

function getAdminPageProps(req, res, next) {
    req.adminPageProps = {
        baseUrl: getBaseUrl(req)
    };

    Promise.all([UserService.getUsers(), getTeamsMappedById(), getRolesMappedById()])
        .then((results) => addAdminUsersToProps(results[0], results[1], results[2]))
        .catch((err) => {
            console.log("error: " + JSON.stringify(err));
            return next(err);
        });

    function addAdminUsersToProps(users, teamNames, roleNames) {
        var adminUsers = [];
        for (let user of users) {
            adminUsers.push(new AdminUser(user, teamNames[user.teamRef].teamName, roleNames[user.roleRef].roleName));
        }
        req.adminPageProps.users = adminUsers;
        req.adminPageProps.teams = teamNames;
        req.adminPageProps.roles = roleNames;

        return next();
    }
}

function renderAdminPage(req, res, next) {
    req.renderData.react = {
        renderedApp: ReactDOMServer.renderToString(React.createFactory(Admin)(req.adminPageProps)),
        bundle: config.react.htmlDir + config.react.components.admin.bundle,
        initProps: req.adminPageProps
    };

    return res.render('admin-homepage', req.renderData)
}

function ensureIsAdmin(req, res, next) {
    if (!req.userObject || !req.userObject.isAdmin) {
        return res.redirect("/");
    }
    return next();
}

function updateUser(req, res, next) {
    if (req.params.userId !== req.body.id) {
        return next(new Error("inconsistent data"))
    }
    UserService.updateUser(req.params.userId, req.userObject._id, req.body).then(data => {
        return res.status(200).send(`Succesfully updated ${req.body.userName}`);
    }).catch(err => {
        return res.status(404).send(err)
    })
}

function getUsers(req, res, next) {
    return res.status(200).send(req.adminPageProps.users);
}

export default router;