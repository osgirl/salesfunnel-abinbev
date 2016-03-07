import {expect} from 'chai';
import app from '../../../app';
import supertest from 'supertest';
import SupertestHelpers from '../../helpers/supertest-helpers.js'
import { ensureUserIsAuthenticated } from '../../helpers/authenticationHelpers.js';
import { VERIFICATION_FAILURE, VERIFICATION_SUCCESS} from '../../../routes/signup/verify-account.js';
import UserFixtures from '../../../model/users/user-fixture.js';
import { fillDbBefore} from '../../helpers/db-helpers.js';

var helpers = new SupertestHelpers(['<html>', '</html>', '<body>', '</body>', '<head>', '</head>']);
var server = supertest.agent(app);

describe("When the user is authenticated", function () {
    ensureUserIsAuthenticated(server);

    it("it should not be possible to verify a new account and the user should be redirected to the homePage", function(done) {
        var expectedURI = `/?error=Please log out before verifying somebody else his token`;

        server.get(`/signup/accept/${UserFixtures[0]._id}/${UserFixtures[0].verificationToken}`)
            .expect(302)
            .expect(function (res) {
                if (res.header.location !== expectedURI) {
                    helpers.throwError(`should redirect to ${expectedURI} but instead was redirected to "${res.header.location}"`)
                }
            })
            .end(done);
    });
});

describe("When the user is not authenticated", function () {
    fillDbBefore();

    it("verifying a new account should redirect the user to the login page with an informational message", function(done) {
        var expectedURI = `/login?info=${VERIFICATION_SUCCESS}`;

        server.get(`/signup/accept/${UserFixtures[0]._id}/${UserFixtures[0].verificationToken}`)
            .expect(302)
            .expect(function (res) {
                if (res.header.location !== expectedURI) {
                    helpers.throwError(`should redirect to ${expectedURI} but instead was redirected to "${res.header.location}"`)
                }
            })
            .end(done);
    });

    it("verifying a new account with an unknown id should redirect the login page with an error message", function(done) {
        var expectedURI = `/login?error=${VERIFICATION_FAILURE}`;

        server.get(`/signup/accept/unknownId/${UserFixtures[0].verificationToken}`)
            .expect(302)
            .expect(function (res) {
                if (res.header.location !== expectedURI) {
                    helpers.throwError(`should redirect to ${expectedURI} but instead was redirected to "${res.header.location}"`)
                }
            })
            .end(done);
    });

    it("verifying a new account with an unknown token should redirect the login page with an error message", function(done) {
        var expectedURI = `/login?error=${VERIFICATION_FAILURE}`;

        server.get(`/signup/accept/${UserFixtures[0]._id}/unknownToken`)
            .expect(302)
            .expect(function (res) {
                if (res.header.location !== expectedURI) {
                    helpers.throwError(`should redirect to ${expectedURI} but instead was redirected to "${res.header.location}"`)
                }
            })
            .end(done);
    });
});