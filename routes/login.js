import express from 'express';
import { addLocalStrategyForUserAuthentication, doUserAuthentication } from '../middleware/passport/passport-middleware.js';
import { Promise } from 'bluebird';
import {RoleService, TeamService} from '../services/index';
var router = express.Router();

addLocalStrategyForUserAuthentication();

function ensureNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
}

/* GET home page. */
router.get('/', ensureNotAuthenticated, doRenderLoginPage);

function doRenderLoginPage(req, res, next) {
    var getTeams = Promise.promisify(TeamService.getTeams);
    var getRoles = Promise.promisify(RoleService.getRoles);

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
        res.render('login-page', {
            metaData: {
                title: 'Sales funnel - reporting tool - AB Inbev',
                description: 'This is a reporting tool by and from AB Inbev to report about sales prospects'
            },
            isAuthenticated: false,
            content: {
                teams: teams,
                roles: roles
            }
        })

    }
};

router.post('/', doUserAuthentication({successRedirect: '/', failureRedirect: '/'}));

export default router;