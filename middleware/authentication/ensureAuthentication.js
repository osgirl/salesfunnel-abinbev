import { getAuthenticatedUser } from '../../middleware/passport/passport-middleware.js';
import { getBaseUrl } from '../../routes/helpers/route-helpers.js';
import path from 'path';

export function ensureNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) return next();
    if (req.authenticationError) return res.redirect(`/?error=${req.authenticationError}`);
    if (req.query.info) return res.redirect(`/?info=${req.query.info}`);
    if (req.query.error) return res.redirect(`/?error=${req.query.error}`);
    return res.redirect(`/`);
}

export function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return _addAuthenticatedUserObject(req, res, next)
    }
    if (req.authenticationError) return res.redirect(`/login?error=${req.authenticationError}`);
    if (req.query.info) return res.redirect(`/login?info=${req.query.info}`);
    if (req.query.error) return res.redirect(`/login?error=${req.query.error}`);
    return res.redirect('/login');
}

export function addGenericAuthenticatedRenderData(req, res, next) {
    var userObject = req.userObject;

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

    return next();
}

function _addAuthenticatedUserObject(req, res, next) {
    return getAuthenticatedUser(req.user.id)
        .then((userObject) => {
            req.userObject = userObject;
            return next();
        })
        .catch(function (err) {
            return next(err);
        });
}

