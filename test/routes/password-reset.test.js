import {expect} from 'chai';
import app from '../../app';
import supertest from 'supertest';
import SupertestHelpers from '../helpers/supertest-helpers.js'
import { ensureVerifiedUserIsAuthenticated } from '../helpers/authentication-helpers.js';
import dbTestSetup from '../../model/db-test-setup.js';
import { getVerifiedUserAccount } from '../../model/users/user-fixture.js';
import PasswordResetRepository from '../../model/password-reset/password-reset-schema.js';
import {PASSWORD_RESET_SENT } from '../../routes/reset-password.js';
import { getRandomString } from '../helpers/random-helpers.js';

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

    it("it should not be possible to reset your password and should be redirected to the homePage", function (done) {
        server.post(resetPasswordPage)
            .expect(302)
            .expect(function (res) {
                if (res.redirect === false) {
                    helpers.throwError("function should redirect")
                }
            })
            .end(done);
    });
});

describe("When the user is not authenticated", function () {
    function getPersistedEmail() {
        var persistedUser = getVerifiedUserAccount();
        return persistedUser.email;
    };

    function verifyResetPasswordEntries(expectedResult, callback) {
        PasswordResetRepository.find({}, (err, result) => {
            if (err) throw err;
            expect(result.length).to.equal(expectedResult);
            callback();
        })
    };

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

    it(`POST ${resetPasswordPage} a valid user creates a new reset password entry and redirects to the homepage with successful message`, function (done) {
        var expectedURI = '/login' + '?info=' + PASSWORD_RESET_SENT + getPersistedEmail();

        verifyResetPasswordEntries(0, resetPasswordRequestForExistingUser);

        function resetPasswordRequestForExistingUser() {
            server
                .post(resetPasswordPage)
                .send({email: getPersistedEmail()})
                .expect(302)
                .expect(function (res) {
                    if (res.header.location !== expectedURI) {
                        helpers.throwError(`should redirect to ${expectedURI} but instead was redirected to "${res.header.location}"`)
                    }
                })
                .end(onResponse);

            function onResponse(err, res) {
                if (err) throw err;
                verifyResetPasswordEntries(1, done);
            }
        }

    });
    it(`POST ${resetPasswordPage} a valid user 2nd password reset request doesn't get a new entry but redirects anyway to the homepage with successful message`, function (done) {
        var expectedURI = '/login' + '?info=' + PASSWORD_RESET_SENT + getPersistedEmail();

        requestResetPassword(function () {
            verifyResetPasswordEntries(1, secondRequestForExistingUser)
        });

        function requestResetPassword(callback) {
            server.post(resetPasswordPage).send({email: getPersistedEmail()}).end(callback);
        }

        function secondRequestForExistingUser() {
            server
                .post(resetPasswordPage)
                .send({email: getPersistedEmail()})
                .expect(302)
                .expect(function (res) {
                    if (res.header.location !== expectedURI) {
                        helpers.throwError(`should redirect to ${expectedURI} but instead was redirected to "${res.header.location}"`)
                    }
                })
                .end(onResponse);

            function onResponse(err, res) {
                if (err) throw err;
                verifyResetPasswordEntries(1, done);
            }
        }

    });

    it(`POST ${resetPasswordPage} a unknown user reset request doesn't get a new entry but redirects anyway to the homepage with successful message`, function (done) {
        var randomEmail = getRandomString();
        var expectedURI = '/login' + '?info=' + PASSWORD_RESET_SENT + randomEmail;

        server
            .post(resetPasswordPage)
            .send({email: randomEmail})
            .expect(302)
            .expect(function (res) {
                if (res.header.location !== expectedURI) {
                    helpers.throwError(`should redirect to ${expectedURI} but instead was redirected to "${res.header.location}"`)
                }
            })
            .end(onResponse);

        function onResponse(err, res) {
            if (err) throw err;
            verifyResetPasswordEntries(0, done);
        }
    });
})
;