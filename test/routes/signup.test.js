import {expect} from 'chai';
import app from '../../app';
import supertest from 'supertest';
import SupertestHelpers from '../helpers/supertest-helpers.js'
import TeamFixtures from '../../model/teams/team-fixture.js';
import RoleFixtures from '../../model/roles/role-fixture.js';
import UserFixtures from '../../model/users/user-fixture.js';
import _ from 'lodash';
import dbTestSetup from '../../model/db-test-setup.js';
import UserService from '../../services/user-service.js';
import { ensureUserIsAuthenticated } from '../helpers/authenticationHelpers.js';

var helpers = new SupertestHelpers(['<html>', '</html>', '<body>', '</body>', '<head>', '</head>']);
var signupPage = '/signup';
var server = supertest.agent(app);
var signupUser = { uname: UserFixtures[0].userName, cemail: UserFixtures[0].email, crole: UserFixtures[0].roleRef, cteam: UserFixtures[0].teamRef, newpassword: UserFixtures[0].pw, cnewpassword: UserFixtures[0].pw};

describe("When the user is authenticated", function() {
    ensureUserIsAuthenticated(server);

    it("it should not be possible to signup for a new account and he should be redirected to the homePage", function(done) {
        server.post(signupPage)
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
        dbTestSetup.cleanDb(function () {
            dbTestSetup.addTeamFixtures(
                dbTestSetup.addRoleFixtures(done)
            );
        });
    });

    it(`POST ${signupPage} a valid user creates a new user and redirects to the validateEmail page`, function (done) {
        UserService.getUsers(function (err, users) {
            expect(users.length).to.equal(0);
            signupNewUser();

            function signupNewUser() {
                server
                    .post(signupPage)
                    .send(signupUser)
                    .expect(200)
                    .end(onResponse);

                function onResponse(err, res) {
                    if (err) throw err;
                    verifyUsers(done);
                }

                function verifyUsers(callback) {
                    UserService.getUsers(function (err, users) {
                        expect(users.length).to.equal(1);
                        callback();
                    });
                }
            }
        });
    });

});