import express from 'express';
import { addLocalStrategyForUserAuthentication, doUserAuthentication } from '../middleware/passport/passport-middleware.js';
import { Promise } from 'bluebird';
import { getTeams } from '../services/team-service.js';
import { getRoles } from '../services/role-service.js';
import { ensureNotAuthenticated } from '../middleware/authentication/ensureAuthentication.js';
var router = express.Router();

addLocalStrategyForUserAuthentication();

/* GET home page. */
router.get('/', ensureNotAuthenticated, doRenderLoginPage);

function doRenderLoginPage(req, res, next) {
    Promise.all([getTeams(), getRoles()])
        .then(function (results) {
            renderPage(results[0], results[1]);
        })
        .catch(function (err) {
            //TODO add better error handling instead of swallowing
            console.log(err);
            next();
        });

    function renderPage(teams, roles) {
        var error = req.query.error || req.flash('error');
        var info = req.query.info;

        res.render('login-page', {
            metaData: {
                title: 'Sales funnel - reporting tool - AB Inbev',
                description: 'This is a reporting tool by and from AB Inbev to report about sales prospects'
            },
            isAuthenticated: false,
            content: {
                error: error,
                info: info,
                teams: teams,
                roles: roles
            }
        })

    }
};

router.post('/', doUserAuthentication({successRedirect: '/', failureRedirect: '/login', failureFlash: true}));

export default router;