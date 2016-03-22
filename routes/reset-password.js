import express from 'express';
import { ensureNotAuthenticated } from '../middleware/authentication/ensureAuthentication.js';
import UserService from '../services/user-service.js';
import { createResetPasswordObject } from '../model/password-reset/password-reset-service.js';
import { getBaseUrl } from './helpers/route-helpers.js';
import { sendPasswordResetEmail} from '../services/email-service.js';

var router = express.Router();

export const PASSWORD_RESET_SENT = "We've sent an email to reset your password to: ";

/* GET home page. */
router.get('/', ensureNotAuthenticated, doRenderResetPasswordPage);

router.post('/',
    ensureNotAuthenticated,
    createResetPasswordEntry,
    redirectToLoginPage
);

function doRenderResetPasswordPage(req, res, next) {
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
export default router;