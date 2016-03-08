import {expect} from 'chai';
import app from '../../../app';
import supertest from 'supertest';
import SupertestHelpers from '../../helpers/supertest-helpers.js'
import { ensureVerifiedUserIsAuthenticated } from '../../helpers/authentication-helpers.js';
import { VERIFICATION_FAILURE, VERIFICATION_SUCCESS} from '../../../routes/signup/verify-account.js';
import { getNewUserAccount } from '../../../model/users/user-fixture.js';
import { fillDbBefore} from '../../helpers/db-helpers.js';
import { getNewObjectId, getRandomUUID } from '../../helpers/random-helpers.js';

var helpers = new SupertestHelpers(['<html>', '</html>', '<body>', '</body>', '<head>', '</head>']);
var server = supertest.agent(app);

describe("When the user is authenticated", function () {
    ensureVerifiedUserIsAuthenticated(server);

    it("it should also be possible to verify a new account and the user should be redirected to the homePage", function(done) {
        var expectedURI = `/login?info=${VERIFICATION_SUCCESS}`;

        server.get(`/signup/accept/${getNewUserAccount()._id}/${getNewUserAccount().verificationToken}`)
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

        server.get(`/signup/accept/${getNewUserAccount()._id}/${getNewUserAccount().verificationToken}`)
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

        server.get(`/signup/accept/${getNewObjectId()}/${getNewUserAccount().verificationToken}`)
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

        server.get(`/signup/accept/${getNewUserAccount()._id}/${getRandomUUID()}`)
            .expect(302)
            .expect(function (res) {
                if (res.header.location !== expectedURI) {
                    helpers.throwError(`should redirect to ${expectedURI} but instead was redirected to "${res.header.location}"`)
                }
            })
            .end(done);
    });
});