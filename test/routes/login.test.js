import {expect} from 'chai';
import app from '../../app';
import supertest from 'supertest';
import SupertestHelpers from '../helpers/supertest-helpers.js'
import TeamFixtures from '../../model/teams/team-fixture.js';
import RoleFixtures from '../../model/roles/role-fixture.js';
import { ensureUserIsAuthenticated, ensurePasswordVerificationIsSuccessful, authenticatedUser } from '../helpers/authenticationHelpers.js';
import { getRandomString } from '../helpers/random-helpers.js';
import _ from 'lodash';
import dbTestSetup from '../../model/db-test-setup.js';
import { DEFAULT_ENSURE_AUTHENTICATED_ERROR } from '../../middleware/authentication/ensureAuthentication.js';

var helpers = new SupertestHelpers(['<html>', '</html>', '<body>', '</body>', '<head>', '</head>']);
var loginPage = '/login';
var server = supertest.agent(app);

describe("When the user is authenticated", function () {
    ensureUserIsAuthenticated(server);

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
    ensurePasswordVerificationIsSuccessful();

    beforeEach(function (done) {
        dbTestSetup.addUserFixtures(done);
    });

    afterEach(function (done) {
        logout(cleanDb);

        function logout(callback) {
            server
                .get('/logout')
                .expect(302)
                .end(callback)
        }

        function cleanDb() {
            dbTestSetup.cleanDb(done);
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
            if (err) throw err;
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
        var response = supertest(app).get(loginPage);

        helpers.verifySuccess(response)
            .expect(function (res) {
                helpers.containsAllSubstrings(res.text, ['<title>Sales funnel - reporting tool - AB Inbev</title>', roleNames, teamNames])
            }).end(done);
    });

    it("GET '/' redirects to the loginPage", function (done) {
        var expectedURI = `/login?error=${DEFAULT_ENSURE_AUTHENTICATED_ERROR}`;

        server
            .get('/')
            .expect(302)
            .expect(function (res) {
                if (res.redirect === false) {
                    helpers.throwError("function should redirect")
                }
                if (res.header.location !== expectedURI) {
                    helpers.throwError(`should redirect to "${expectedURI}" but instead was redirected to "${res.header.location}"`)
                }
            })
            .end(done);
    });

    var infoMessage = getRandomString();

    it(`GET '/info=${infoMessage} shows info message on the login page`, function (done) {
        var expectedURI = `/login?info=${infoMessage}`;

        var response = supertest(app).get(expectedURI);

        helpers.verifySuccess(response)
            .expect(function (res) {
                helpers.containsAllSubstrings(res.text, ['<title>Sales funnel - reporting tool - AB Inbev</title>', infoMessage])
            }).end(done);
    });

});