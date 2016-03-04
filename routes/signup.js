import express from 'express';
import { Promise } from 'bluebird';
import UserService from '../services/user-service.js';
import { hashPassword } from '../middleware/crypto/crypto-pbkdf2.js';

var router = express.Router();

export const PW_NOT_EQUAL_VIOLATION = "Both passwords should be equal";
export const PW_LENGTH_VIOLATION = "Password should be at least 8 characters";
export const DUPLICATE_EMAIL_ERROR = "A user with this email is already registered";
export const ANOTHER_ERROR = "'Unable to signup currently'";

/* GET home page. */
router.post('/', ensureNotAuthenticated, signupRoute);

function ensureNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) return next();
    return res.redirect('/');
}

function signupRoute(req, res, next) {
    var body = req.body;

    validatePostBody(body, transformUserObject);

    function transformUserObject(err) {
        if (err) return redirectWithError(err);
        doTransformUserObject(body, saveUserObject);
    }

    function saveUserObject(err, user) {
        if (err) return redirectWithError(err);
        doSaveUserObject(user, handlePersistedUser)
    }

    function handlePersistedUser(err, persistedUser) {
        if (err) return redirectWithError(err);
        sendEmailToUser(persistedUser.email);
        redirect(persistedUser);
    }

    function redirect(persistedUser) {
        return res.render('validate-email-page', {
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
        if (!error) error = ANOTHER_ERROR;
        return res.redirect('/login' + '?error=' + error + "#signup");
    };
};

function validatePostBody(body, callback) {
    if (body.newpassword !== body.cnewpassword) {
        return callback(PW_NOT_EQUAL_VIOLATION);
    }
    if (!body.newpassword || body.newpassword.length < 8) {
        return callback(PW_LENGTH_VIOLATION)
    }
    return callback(null);
}

function doTransformUserObject(body, callback) {
    return hashPassword(body.newpassword, createUserObject);

    function createUserObject(err, hashedPassword) {
        var user = {
            userName: body.uname,
            email: body.cemail,
            roleRef: body.crole,
            teamRef: body.cteam,
            pw: hashedPassword
        };
        return callback(err, user);
    }
}

function doSaveUserObject(user, callback) {
    return UserService.createUser(user, function (err, persistedUser) {
        if (err) {
            if (err.errmsg.indexOf('E11000 duplicate key error') > -1) {
                var error = DUPLICATE_EMAIL_ERROR;
            } else {
                var error = ANOTHER_ERROR;
            }
        }
        return callback(error, persistedUser);
    });
}

function sendEmailToUser(email) {
    //    TODO implement send email to user with node-email-templates!
}

export default router;