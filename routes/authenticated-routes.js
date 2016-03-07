import express from 'express';
import { getAuthenticatedUser } from '../middleware/passport/passport-middleware.js';
import { ensureAuthenticated } from '../middleware/authentication/ensureAuthentication.js';
var router = express.Router();

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
    var error = req.query.error;

    res.render('welcome-page', {
        metaData: {
            title: 'Sales funnel - reporting tool - AB Inbev',
            description: 'This is a reporting tool by and from AB Inbev to report about sales prospects'
        },
        isAuthenticated: true,
        content: {
            error: error,
            user: req.user
        }
    });
}

export default router;