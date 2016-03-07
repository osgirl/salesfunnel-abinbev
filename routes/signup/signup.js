import express from 'express';
import { addVerifyAccountRoutes } from './verify-account.js';
import { addConfirmTokenRoutes} from './confirm-token.js';
import { Promise } from 'bluebird';
import UserService from '../../services/user-service.js';
import { hashPassword } from '../../middleware/crypto/crypto-pbkdf2.js';
import { sendVerificationEmails } from '../../services/email-service.js';
import { ensureNotAuthenticated } from '../../middleware/authentication/ensureAuthentication.js';
import { getBaseUrl } from '../helpers/route-helpers.js';

var router = express.Router();

export const PW_NOT_EQUAL_VIOLATION = "Both passwords should be equal";
export const PW_LENGTH_VIOLATION = "Password should be at least 8 characters";
export const DUPLICATE_EMAIL_ERROR = "A user with this email is already registered";
export const ANOTHER_ERROR = "'Unable to signup currently'";
export const EMAIL_RESEND_SUCCESS = "A new verification email has been send to your email address";
export const EMAIL_RESEND_FAILURE = "We are sorry, we were not able to resend you an email";

addVerifyAccountRoutes(router);
addConfirmTokenRoutes(router);
router.post('/',
    function (req, res, next) {
        req.authenticationError = `Please log out before signing up another user`;
        next();
    },
    ensureNotAuthenticated,
    signupRoute);

router.get('/resend/:userId',
    ensureNotAuthenticated,
    resendEmailRoute);

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
        sendVerificationEmails(persistedUser, getBaseUrl(req));
        redirectToValidateEmailPage(res, persistedUser);
    }


    function redirectWithError(error) {
        if (!error) error = ANOTHER_ERROR;
        return res.redirect('/login' + '?error=' + error + "#signup");
    }
}

function resendEmailRoute(req, res, next) {
    UserService.findById(req.params.userId)
        .then(function (persistedUser) {
            sendVerificationEmails(persistedUser, getBaseUrl(req))
                .then(function (result) {
                    return redirectToValidateEmailPage(res, persistedUser, EMAIL_RESEND_SUCCESS)
                })
                .catch(function (err) {
                    return redirectToValidateEmailPage(res, persistedUser, null, EMAIL_RESEND_FAILURE)
                });
        })
        .catch(function (err) {
            return res.redirect('/login' + '?error=' + EMAIL_RESEND_FAILURE);
        });
}

function redirectToValidateEmailPage(res, persistedUser, info, error) {
    var resendEmailUrl = `/signup/resend/${persistedUser._id}`;
    return res.render('validate-email-page', {
        metaData: {
            title: 'Sales funnel - reporting tool - AB Inbev',
            description: 'This is a reporting tool by and from AB Inbev to report about sales prospects'
        },
        isAuthenticated: false,
        content: {
            info: info,
            error: error,
            user: persistedUser,
            resendEmailUrl: resendEmailUrl
        }
    })
}

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

export default router;