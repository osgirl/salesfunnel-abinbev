import {expect} from 'chai';
import app from '../../app';
import supertest from 'supertest';
import SupertestHelpers from '../helpers/supertest-helpers.js'
import TeamFixtures from '../../model/teams/team-fixture.js';
import RoleFixtures from '../../model/roles/role-fixture.js';
import _ from 'lodash';
import dbTestSetup from '../../model/db-test-setup.js';
import { ensureUserIsAuthenticated } from '../helpers/authenticationHelpers.js';

var helpers = new SupertestHelpers(['<html>', '</html>', '<body>', '</body>', '<head>', '</head>']);
var logoutPage = '/logout';
var request = supertest.agent(app);

describe("When the user is not authenticated", function () {

    it(`GET '${logoutPage}' redirects to '/login`, function (done) {
        request.get(logoutPage)
            .expect(302)
            .expect(function (res) {
                if (res.redirect === false) {
                    helpers.throwError("function should redirect")
                }
                if (res.header.location !== '/login') {
                    helpers.throwError(`should redirect to '/' but instead was redirected to "${res.header.location}"`)
                }
            })
            .end(done);
    });
});

describe("When the user is authenticated", function () {
    ensureUserIsAuthenticated(request);

    it(`GET '${logoutPage}' redirects to the loginPage`, function (done) {
            expectThatTheUserIsLoggedIn(function () {
                doLogoutAndExpectRedirect(function () {
                    expectThatTheUserIsLoggedOut(done)
                })
            });

            function expectThatTheUserIsLoggedIn(callback) {
                request.get('/').expect(200).end(onResponse);

                function onResponse(err, res) {
                    if (err) throw err;
                    callback();
                }
            }

            function doLogoutAndExpectRedirect(callback) {
                request.get(logoutPage)
                    .expect(302)
                    .expect(function (res) {
                        if (res.redirect === false) {
                            helpers.throwError("function should redirect")
                        }
                        if (res.header.location !== '/login') {
                            helpers.throwError(`should redirect to '/login' but instead was redirected to "${res.header.location}"`)
                        }
                    }).end(onResponse);

                function onResponse(err, res) {
                    if (err) throw err;
                    callback();
                }
            }

            function expectThatTheUserIsLoggedOut(callback) {
                request.get('/')
                    .expect(302)
                    .expect(function (res) {
                        if (res.redirect === false) {
                            helpers.throwError("function should redirect as the user is not logged in anymore")
                        }
                        if (res.header.location.indexOf('/login') === -1) {
                            helpers.throwError(`should redirect to '/login' but instead was redirected to "${res.header.location}"`)
                        }
                    })
                    .end(onResponse);

                function onResponse(err, res) {
                    if (err) throw err;
                    callback();
                }
            }
        }
    )
    ;

});