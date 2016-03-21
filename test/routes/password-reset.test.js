import {expect} from 'chai';
import app from '../../app';
import supertest from 'supertest';
import SupertestHelpers from '../helpers/supertest-helpers.js'
import { ensureVerifiedUserIsAuthenticated } from '../helpers/authentication-helpers.js';
import dbTestSetup from '../../model/db-test-setup.js';

var helpers = new SupertestHelpers(['<html>', '</html>', '<body>', '</body>', '<head>', '</head>']);
var resetPasswordPage = '/reset-password';
var server = supertest.agent(app);

describe("When the user is authenticated", function () {
    ensureVerifiedUserIsAuthenticated(server);

    it(`GET '${resetPasswordPage}' redirects to the homePage`, function (done) {
        server.get(resetPasswordPage)
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
        dbTestSetup.addUserFixtures(done);
    });

    afterEach(function (done) {
        dbTestSetup.cleanDb(done);
    });

    it(`GET '${resetPasswordPage}' gives the resetPassword page`, function (done) {
        var response = supertest(app).get(resetPasswordPage);

        helpers.verifySuccess(response)
            .expect(function (res) {
                helpers.containsAllSubstrings(res.text, ['<title>Sales funnel - reporting tool - AB Inbev</title>'])
            }).end(done);
    });

});