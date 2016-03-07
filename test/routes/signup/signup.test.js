import {expect} from 'chai';
import app from '../../../app';
import supertest from 'supertest';
import SupertestHelpers from '../../helpers/supertest-helpers.js'
import UserFixtures from '../../../model/users/user-fixture.js';
import _ from 'lodash';
import UserService from '../../../services/user-service.js';
import { ensureUserIsAuthenticated } from '../../helpers/authenticationHelpers.js';
import { PW_NOT_EQUAL_VIOLATION, PW_LENGTH_VIOLATION, DUPLICATE_EMAIL_ERROR } from '../../../routes/signup/signup.js';
import { fillDbBefore} from '../../helpers/db-helpers.js';

var helpers = new SupertestHelpers(['<html>', '</html>', '<body>', '</body>', '<head>', '</head>']);
var signupPage = '/signup';
var server = supertest.agent(app);

function getSignupUser() {
    return {
        uname: UserFixtures[0].userName,
        cemail: "anotherEmail@email.com",
        crole: UserFixtures[0].roleRef,
        cteam: UserFixtures[0].teamRef,
        newpassword: UserFixtures[0].pw,
        cnewpassword: UserFixtures[0].pw
    }
};

describe("When the user is authenticated", function () {
    ensureUserIsAuthenticated(server);

    it("it should not be possible to signup for a new account and he should be redirected to the homePage", function (done) {
        server.post(signupPage)
            .expect(302)
            .expect(function (res) {
                if (res.redirect === false) {
                    helpers.throwError("function should redirect")
                }
            })
            .end(done);
    });

    it("it should not be possible to signup for a new account and this message should be shown to the user after redirection", function(done) {
        var expectedURI = `/?error=Please log out before signing up another user`;
        server.post(signupPage)
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

    it(`POST ${signupPage} a valid user creates a new user and redirects to the validateEmail page`, function (done) {
        verifyUsers(UserFixtures.length, signup);

        function signup() {
            server
                .post(signupPage)
                .send(getSignupUser())
                .expect(200)
                .end(onResponse);

            function onResponse(err, res) {
                if (err) throw err;
                verifyUsers(UserFixtures.length + 1, done);
            }
        }

        function verifyUsers(expectedResult, callback) {
            UserService.getUsers(function (err, users) {
                expect(users.length).to.equal(expectedResult);
                callback();
            });
        }
    });

    it(`POST ${signupPage} a user with a password less then 8 characters returns a validation error`, function (done) {
        var user = getSignupUser();
        user.newpassword = 'shortPw';
        user.cnewpassword = 'shortPw';

        server
            .post(signupPage)
            .send(user)
            .expect(302)
            .expect(function (res) {
                if (res.redirect === false) {
                    helpers.throwError("function should redirect")
                }
                if (res.header.location !== '/login' + '?error=' + PW_LENGTH_VIOLATION + "#signup") {
                    helpers.throwError(`should redirect to '/login' but instead was redirected to "${res.header.location}"`)
                }
            })
            .end(onResponse);

        function onResponse(err, res) {
            if (err) throw err;
            verifyUsers(UserFixtures.length, done);
        }

        function verifyUsers(expectedResult, callback) {
            UserService.getUsers(function (err, users) {
                expect(users.length).to.equal(expectedResult);
                callback();
            });
        }
    });

    it(`POST ${signupPage} a user with an email addres that already exists returns a validation error`, function (done) {
        verifyUsers(UserFixtures.length, signup);
        var user = getSignupUser();
        user.cemail = UserFixtures[0].email;

        function signup() {
            server
                .post(signupPage)
                .send(user)
                .expect(302)
                .expect(function (res) {
                    if (res.redirect === false) {
                        helpers.throwError("function should redirect")
                    }
                    if (res.header.location !== '/login' + '?error=' + DUPLICATE_EMAIL_ERROR + "#signup") {
                        helpers.throwError(`should redirect to '/login' but instead was redirected to "${res.header.location}"`)
                    }
                })
                .end(onResponse);

            function onResponse(err, res) {
                if (err) throw err;
                verifyUsers(UserFixtures.length, done);
            }
        }

        function verifyUsers(expectedResult, callback) {
            UserService.getUsers(function (err, users) {
                expect(users.length).to.equal(expectedResult);
                callback();
            });
        }
    });

    it(`POST ${signupPage} a user with two different passwords returns a validation error`, function (done) {
        var user = getSignupUser();
        user.newpassword = 'shortPw';
        user.cnewpassword = 'anotherPw';
        verifyUsers(UserFixtures.length, signup);

        function signup() {
            server
                .post(signupPage)
                .send(user)
                .expect(302)
                .expect(function (res) {
                    if (res.redirect === false) {
                        helpers.throwError("function should redirect")
                    }
                    if (res.header.location !== '/login' + '?error=' + PW_NOT_EQUAL_VIOLATION + "#signup") {
                        helpers.throwError(`should redirect to '/login' but instead was redirected to "${res.header.location}"`)
                    }
                })
                .end(onResponse);

            function onResponse(err, res) {
                if (err) throw err;
                verifyUsers(UserFixtures.length, done);
            }
        }

        function verifyUsers(expectedResult, callback) {
            UserService.getUsers(function (err, users) {
                expect(users.length).to.equal(expectedResult);
                callback();
            });
        }
    });

});