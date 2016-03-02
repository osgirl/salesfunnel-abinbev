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
var helpers = new SupertestHelpers(['<html>', '</html>', '<body>', '</body>', '<head>', '</head>']);
var signupPage = '/signup';
var server = supertest.agent(app);
var authenticatedUser = {username: 'admin@admin.com', password: 'admin@admin.com'};

describe("When the user is authenticated", function() {

    beforeEach(function (done) {
        server
            .post('/login')
            .send(authenticatedUser)
            .expect(302)
            .end(done);
    });

    afterEach(function (done) {
        server
            .get('/logout')
            .expect(302)
            .end(done)
    });

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
                supertest.agent(app)
                    .post(signupPage)
                    .send(UserFixtures[0])
                    .expect(200)
                    .end(onResponse);

                function onResponse(err, res) {
                    verifyUsers(function () {
                        if (err) return done(err);
                        return done();
                    });
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