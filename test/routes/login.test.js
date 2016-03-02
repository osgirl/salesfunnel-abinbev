import {expect} from 'chai';
import app from '../../app';
import supertest from 'supertest';
import SupertestHelpers from '../helpers/supertest-helpers.js'
import TeamFixtures from '../../model/teams/team-fixture.js';
import RoleFixtures from '../../model/roles/role-fixture.js';
import _ from 'lodash';
import dbTestSetup from '../../model/db-test-setup.js';
var helpers = new SupertestHelpers(['<html>', '</html>', '<body>', '</body>', '<head>', '</head>']);
var loginPage = '/login';
var authenticatedUser = {username: 'admin@admin.com', password: 'admin@admin.com'};
var server = supertest.agent(app);

describe("When the user is authenticated", function () {

    beforeEach(function (done) {
        server
            .post(loginPage)
            .send(authenticatedUser)
            .expect(302)
            .end(done);
    });

    afterEach(function (done) {
        server
            .get('/logout')
            .end(done)
    });

    it(`GET '${loginPage}' redirects to the homePage`, function (done) {
        server.get(loginPage)
            .expect(302)
            .expect(function (res) {
                if (res.redirect === false) {
                    helpers.throwError("function should redirect")
                }
                if (res.header.location !== '/') {
                    helpers.throwError(`should redirect to '/' but instead was redirected to "${res.header.location}"`)
                }
            })
            .end(done);
    });
});

describe("When the user is not authenticated", function () {
    beforeEach(function (done) {
        dbTestSetup.addTeamFixtures(
            dbTestSetup.addRoleFixtures(done)
        );
    });

    afterEach(function (done) {
        dbTestSetup.cleanDb(logout);

        function logout() {
            server
                .get('/logout')
                .expect(302)
                .end(done)
        }
    });

    it(`POST ${loginPage} logs the existing user in`, function (done) {
        server
            .post(loginPage)
            .send(authenticatedUser)
            .expect(302)
            .expect('Location', '/')
            .end(onResponse);

        function onResponse(err, res) {
            if (err) return done(err);
            return done();
        }
    });

    it(`GET '${loginPage}' gives the loginPage`, function (done) {
        var roleNames = [];
        var teamNames = [];

        _.forEach(TeamFixtures, function (TeamFixture) {
            teamNames.push(TeamFixture.teamName);
        });
        _.forEach(RoleFixtures, function (RoleFixture) {
            roleNames.push(RoleFixture.roleName);
        });
        var reponse = supertest(app).get(loginPage);

        helpers.verifySuccess(reponse)
            .expect(function (res) {
                helpers.containsAllSubstrings(res.text, ['<title>Sales funnel - reporting tool - AB Inbev</title>', roleNames, teamNames])
            }).end(done);
    });

    it("GET '/' redirects to the loginPage", function (done) {
        server
            .get('/')
            .expect(302)
            .expect(function (res) {
                if (res.redirect === false) {
                    helpers.throwError("function should redirect")
                }
                if (res.header.location !== loginPage) {
                    helpers.throwError(`should redirect to "${loginPage}" but instead was redirected to "${res.header.location}"`)
                }
            })
            .end(done);
    });

});