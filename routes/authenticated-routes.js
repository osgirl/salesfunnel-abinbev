import express from 'express';
import { getAuthenticatedUser } from '../middleware/passport/passport-middleware.js';
var router = express.Router();

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}

/* GET home page. */
router.get('/', ensureAuthenticated, function (req, res, next) {
    req.userObject = getAuthenticatedUser(req.user.id)
        .then(function (userObject) {
            req.userObject = userObject;
            renderWelcomePage(req, res)
        })
        .catch(function (err) {
            //TODO add better error handling instead of swallowing
            console.log(err);
            next();
        });
});

function renderWelcomePage(req, res) {
    res.render('welcome-page', {
        metaData: {
            title: 'Sales funnel - reporting tool - AB Inbev',
            description: 'This is a reporting tool by and from AB Inbev to report about sales prospects'
        },
        isAuthenticated: true,
        content: {
            user: req.user
        }
    });
}

export default router;