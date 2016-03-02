import express from 'express';
import { Promise } from 'bluebird';
import UserService from '../services/user-service.js';
var router = express.Router();

function ensureNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
}

/* GET home page. */
router.post('/', ensureNotAuthenticated, signupRoute);

function signupRoute(req, res, next) {
    var body = req.body;

    validatePostBody(function () {
        transformUserObject(function (user) {
            saveUserObject(user, function (persistedUser) {
                sendEmailToUser(persistedUser.email, function () {
                    redirect(persistedUser)
                })
            })
        });
    });

    function validatePostBody(callback) {
        if (body.newpassword !== body.cnewpassword) {
            //TODO how to handle error?
            throw new Error("both passwords should be equal");
        }
        callback();
    }

    function transformUserObject(callback) {
        var user = {
            userName: body.uname,
            email: body.cemail,
            roleRef: body.crole,
            teamRef: body.cteam,
            pw: body.newpassword
        };
        callback(user);
    }

    function saveUserObject(user, callback) {
        UserService.createUser(user, function (err, persistedUser) {
            if (err) {
                //TODO how to handle error?
                next(err);
            }
            callback(persistedUser);
        });
    }

    function sendEmailToUser(email, callback) {
    //    TODO implement send email to user!
        callback();
    }

    function redirect(persistedUser) {
        res.render('validate-email-page', {
            metaData: {
                title: 'Sales funnel - reporting tool - AB Inbev',
                description: 'This is a reporting tool by and from AB Inbev to report about sales prospects'
            },
            isAuthenticated: false,
            content: {
                user: persistedUser
            }
        })
    }
};

export default router;