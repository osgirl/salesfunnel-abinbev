import express from 'express';
import { addLocalStrategyForUserAuthentication, doUserAuthentication } from '../middleware/passport/passport-middleware.js';
import { Promise } from 'bluebird';
import {roleService, teamService} from '../services/index';
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
router.get('/', ensureNotAuthenticated, unAuthenticatedRoute);

function unAuthenticatedRoute(req, res, next) {
    if (!req.isAuthenticated()) {
        renderHomePage()
    } else {
        next();
    }

    function renderHomePage() {
        var getTeams = Promise.promisify(roleService.getTeams);
        var getRoles = Promise.promisify(teamService.getRoles);

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
            res.render('home-page', {
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
    }
};

router.post('/', doUserAuthentication({ successRedirect: '/', failureRedirect: '/'}));

export default router;