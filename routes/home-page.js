import express from 'express';
import { Promise } from 'bluebird';
import {roleService} from '../services/index';
import {teamService} from '../services/index';
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    var getTeams = Promise.promisify(roleService.getTeams);
    var getRoles = Promise.promisify(teamService.getRoles);

    Promise.all([getTeams(), getRoles()])
        .then(function (results) {
            renderPage(results[0], results[1]);
        })
        .catch(function (err) {
            console.log(JSON.stringify(err));
            next(err)
        });

    function renderPage(teams, roles) {
        res.render('home-page', {
            metaData: {
                title: 'Sales funnel - reporting tool - AB Inbev',
                description: 'This is a reporting tool by and from AB Inbev to report about sales prospects'
            },
            content: {
                teams: teams,
                roles: roles
            }
        })

    }
})
;

export default router;