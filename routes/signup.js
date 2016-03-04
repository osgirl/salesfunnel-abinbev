import express from 'express';
import { Promise } from 'bluebird';
import UserService from '../services/user-service.js';
import { hashPassword } from '../middleware/crypto/crypto-pbkdf2.js';

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

    validatePostBody(function (err) {
        if (err) redirectWithError(err);
        transformUserObject(function (err, user) {
            if (err) redirectWithError(err);
            saveUserObject(user, function (err, persistedUser) {
                if (err) redirectWithError(err);
                sendEmailToUser(persistedUser.email);
                redirect(persistedUser);
            })
        });
    });

    function validatePostBody(callback) {
        if (body.newpassword !== body.cnewpassword) {
            callback("both passwords should be equal");
        }
        if (!body.newpassword || body.newpassword.length < 8) {
            callback("password should be at least 8 characters")
        }
        callback(null);
    }

    function transformUserObject(callback) {
        hashPassword(body.newpassword, createUserObject);

        function createUserObject(err, hashedPassword) {
            var user = {
                userName: body.uname,
                email: body.cemail,
                roleRef: body.crole,
                teamRef: body.cteam,
                pw: hashedPassword
            };
            callback(err, user);
        }
    }

    function saveUserObject(user, callback) {
        UserService.createUser(user, function (err, persistedUser) {
            if (err) {
                if (err.errmsg.indexOf('E11000 duplicate key error') > -1) {
                    var error = 'a user with this email is already registered';
                } else {
                    var error = 'currently unable to signup';
                }
            }
            callback(error, persistedUser);
        });
    }

    function sendEmailToUser(email) {
        //    TODO implement send email to user with node-email-templates!
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

    function redirectWithError(error) {
        if (!error) error = 'Unable to signup currently';
        res.redirect('/login' + '?error=' + error + "#signup");
    }
};

export default router;