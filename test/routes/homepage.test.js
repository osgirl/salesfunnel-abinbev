import {expect} from 'chai';
import app from '../../app';
import supertest from 'supertest';
import SupertestHelpers from '../helpers/supertest-helpers.js'
import TeamFixtures from '../../model/teams/team-fixture.js';
import RoleFixtures from '../../model/roles/role-fixture.js';
import _ from 'lodash';
import dbTestSetup from '../../model/db-test-setup.js';

var helpers = new SupertestHelpers(['<html>', '</html>', '<body>', '</body>', '<head>', '</head>']);
var homePage = '/';
var authenticatedUser = {username: 'admin@admin.com', password: 'admin@admin.com'};
var request = supertest.agent(app);

describe("When the user is not authenticated", function () {

    it(`GET '${homePage}' redirects to the loginPage`, function (done) {
        request.get(homePage)
            .expect(302)
            .expect(function (res) {
                if (res.redirect === false) {
                    helpers.throwError("function should redirect")
                }
                if (res.header.location !== '/login') {
                    helpers.throwError(`should redirect to '/login' but instead was redirected to "${res.header.location}"`)
                }
            })
            .end(done);
    });
});

describe("When the user is authenticated", function () {
    beforeEach(function (done) {
        dbTestSetup.cleanDb(login);
        function login () {
            request
                .post('/login')
                .send(authenticatedUser)
                .expect(302)
                .end(done);
        }
    });

    it(`GET '${homePage}' gives the homePage`, function (done) {
        var reponse = request.get(homePage);

        helpers.verifySuccess(reponse)
            .expect(function (res) {
                helpers.containsAllSubstrings(res.text, ['<title>Sales funnel - reporting tool - AB Inbev</title>', authenticatedUser.username])
            }).end(done);
    });

});