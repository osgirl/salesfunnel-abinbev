import express from 'express';
import { ensureNotAuthenticated } from '../middleware/authentication/ensureAuthentication.js';
import UserService from '../services/user-service.js';
import { createResetPasswordObject, verifyValidPwResetToken, updatePasswordObject } from '../model/password-reset/password-reset-service.js';
import { getBaseUrl } from './helpers/route-helpers.js';
import { sendPasswordResetEmail} from '../services/email-service.js';
import { PW_NOT_EQUAL_VIOLATION, PW_LENGTH_VIOLATION} from './signup/signup.js';
import { hashPassword } from '../middleware/crypto/crypto-pbkdf2.js';

var router = express.Router();

export const PASSWORD_RESET_SENT = "We've sent an email to reset your password to: ";
export const VERIFICATION_FAILURE = "This token isn't valid. Perhaps you already used it?";
export const VERIFICATION_SUCCESS = "Resetting your password was successful, you can now login by using it.";
export const UPDATE_PW_FAILURE = "sorry, updating your password didn't work out, please try again.";


router.get('/',
    ensureNotAuthenticated,
    renderResetPasswordPage
);

router.post('/',
    ensureNotAuthenticated,
    createResetPasswordEntry,
    redirectToLoginPage
);

router.get('/reset/:pwResetToken',
    ensureNotAuthenticated,
    verifyPwResetToken,
    renderCreateNewPasswordPage);

router.post('/reset/:pwResetToken',
    ensureNotAuthenticated,
    verifyPwResetToken,
    validatePostBody,
    hashNewPassword,
    saveNewPassword);

function renderResetPasswordPage(req, res, next) {
    res.render('reset-password-page', {
        metaData: {
            title: 'Sales funnel - reporting tool - AB Inbev',
            description: 'This is a reporting tool by and from AB Inbev to report about sales prospects'
        },
        isAuthenticated: false
    })
}

function createResetPasswordEntry(req, res, next) {
    var body = req.body;

    res.info = PASSWORD_RESET_SENT + body.email;

    return doSilentlyValidateEmail(body)
        .then(saveResetPasswordObject)
        .then(sendEmail)
        .catch(function (err) {
            return next();
        });

    function doSilentlyValidateEmail(body) {
        return UserService.findByEmail(body.email)
            .then(function (user) {
                if (!user) {
                    return Promise.reject(new Error(`email address doesn't exist`));
                }
                return user;
            });
    }

    function saveResetPasswordObject(user) {
        return createResetPasswordObject(user._id)
            .then(function (pwResetToken) {
                return {user: user, pwResetToken: pwResetToken};
            });
    }

    function sendEmail(resetEmailObject) {
        var user = resetEmailObject.user;
        var pwResetToken = resetEmailObject.pwResetToken;

        sendPasswordResetEmail(user, pwResetToken, getBaseUrl(req)); //async
        return next();
    }
}

function redirectToLoginPage(req, res, next) {
    return res.redirect('/login' + '?info=' + res.info);
}

function verifyPwResetToken(req, res, next) {
    verifyValidPwResetToken(req.params.pwResetToken)
        .then(function (userId) {
            req.userId = userId;
            return next();
        })
        .catch(function () {
            return res.redirect(`/login?error=${VERIFICATION_FAILURE}`)
        });
}

function renderCreateNewPasswordPage(req, res, next) {
    res.render('create-new-password-page', {
        metaData: {
            title: 'Sales funnel - reporting tool - AB Inbev',
            description: 'This is a reporting tool by and from AB Inbev to report about sales prospects'
        },
        isAuthenticated: false,
        pwResetToken: req.params.pwResetToken
    })
}

function validatePostBody(req, res, next) {
    var body = req.body;
    if (body.newpassword !== body.cnewpassword) {
        return redirect(res, {error: PW_NOT_EQUAL_VIOLATION});
    }
    if (!body.newpassword || body.newpassword.length < 8) {
        return redirect(res, {error: PW_LENGTH_VIOLATION})
    }
    return next();
}

function hashNewPassword(req, res, next) {
    return hashPassword(req.body.newpassword, updateHashedPassword);

    function updateHashedPassword(err, hashedPassword) {
        if (err) return redirect(res, {error: UPDATE_PW_FAILURE});
        req.pw = hashedPassword;
        return next();
    }
}

function saveNewPassword(req, res, next) {
    var userId = req.userId;
    var password = req.pw;

    UserService.updatePassword(userId, password)
        .then(function () {
            return updatePasswordObject(req.params.pwResetToken)
                .then(function () {
                    return redirect(res, {info: VERIFICATION_SUCCESS})
                })
        }).catch(function () {
            return redirect(res, {error: UPDATE_PW_FAILURE})
        })
}

function redirect(res, redirectObject) {
    if (redirectObject.error) {
        return res.redirect(`/login?error=${redirectObject.error}`)
    } else if (redirectObject.info) {
        return res.redirect(`/login?info=${redirectObject.info}`)
    } else {
        return res.redirect(`/login`);
    }
}

export default router;