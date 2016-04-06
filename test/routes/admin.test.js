import {expect} from 'chai';
import app from '../../app';
import supertest from 'supertest';
import SupertestHelpers from '../helpers/supertest-helpers.js'
import { getRandomString } from '../helpers/random-helpers.js';
import { getNationalSalesManager, getSalesManager, getRep } from '../../model/roles/role-fixture.js';
import { getVerifiedUserAccount, getNewUserAccount } from '../../model/users/user-fixture.js';
import _ from 'lodash';
import { getResendEmailUrl } from '../../routes/signup/signup.js';
import { ensureUnverifiedUserIsAuthenticated, ensureVerifiedUserIsAuthenticated, authenticatedUser } from '../helpers/authentication-helpers.js';

var helpers = new SupertestHelpers(['<html>', '</html>', '<body>', '</body>', '<head>', '</head>']);
var adminPage = '/admin';
var request = supertest.agent(app);

describe("When the user is not authenticated", function () {
    it(`GET '${adminPage}' redirects to the loginPage`, function (done) {
        var expectedURI = `/login`;

        request.get(adminPage)
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

    it(`GET /admin/users redirects to the loginPage`, function(done) {
        var expectedURI = `/login`;

        request.get("/admin/users")
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

describe("When the user is authenticated, but not yet verified", function () {
    ensureUnverifiedUserIsAuthenticated(request);

    it(`GET '${adminPage}' redirects to the homePage`, function (done) {
        var expectedURI = `/`;

        request.get(adminPage)
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

describe("When the user is authenticated and fully verified, but not an admin", function () {
    ensureVerifiedUserIsAuthenticated(request);

    it(`GET '${adminPage}' redirects to the homePage`, function (done) {
        var expectedURI = `/`;

        request.get(adminPage)
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

describe("When the user is authenticated and fully verified, and an admin", function () {
    var isAdmin = true;
    ensureVerifiedUserIsAuthenticated(request, null, isAdmin);

    it(`GET '${adminPage}' gets the adminPage`, function (done) {
        var response = request.get(adminPage);
        var user = getVerifiedUserAccount();

        helpers.verifySuccess(response)
            .expect(function (res) {
                helpers.containsAllSubstrings(res.text, ['<title>Sales funnel - reporting tool - AB Inbev</title>', user.userName, 'admin section']);
            }).end(done);
    });

    it(`GET /admin/users gets the users`, function(done) {
        var response = request.get("/admin/users");

        response
            .expect(function (res) {
                expect(res).not.to.be.null;
            }).end(done);
    });

});