import {expect} from 'chai';
import app from '../../app';
import supertest from 'supertest';
import SupertestHelpers from '../helpers/supertest-helpers.js'
import { getRandomString } from '../helpers/random-helpers.js';
import TeamFixtures from '../../model/teams/team-fixture.js';
import RoleFixtures from '../../model/roles/role-fixture.js';
import _ from 'lodash';
import dbTestSetup from '../../model/db-test-setup.js';
import { ensureUserIsAuthenticated, authenticatedUser } from '../helpers/authenticationHelpers.js';
import { DEFAULT_ENSURE_AUTHENTICATED_ERROR } from '../../middleware/authentication/ensureAuthentication.js';

var helpers = new SupertestHelpers(['<html>', '</html>', '<body>', '</body>', '<head>', '</head>']);
var homePage = '/';
var request = supertest.agent(app);

describe("When the user is not authenticated", function () {
    it(`GET '${homePage}' redirects to the loginPage`, function (done) {
        var expectedURI = `/login?error=${DEFAULT_ENSURE_AUTHENTICATED_ERROR}`;

        request.get(homePage)
            .expect(302)
            .expect(function (res) {
                if (res.redirect === false) {
                    helpers.throwError("function should redirect")
                }
                if (res.header.location !== expectedURI) {
                    helpers.throwError(`should redirect to ${expectedURI} but instead was redirected to "${res.header.location}"`)
                }
            })
            .end(done);
    });
});

describe("When the user is authenticated", function () {
    ensureUserIsAuthenticated(request);

    it(`GET '${homePage}' gives the homePage`, function (done) {
        var reponse = request.get(homePage);

        helpers.verifySuccess(reponse)
            .expect(function (res) {
                helpers.containsAllSubstrings(res.text, ['<title>Sales funnel - reporting tool - AB Inbev</title>', authenticatedUser.username])
            }).end(done);
    });

    it(`GET '${homePage}' with error shows the error on the screen`, function(done) {
        var errorText = getRandomString();
        var response = request.get(homePage + "?error=" + errorText);

        helpers.verifySuccess(response)
        .expect(function (res) {
                helpers.containsAllSubstrings(res.text, [authenticatedUser.username, errorText])
            }).end(done);
    });
});