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
var homePage = '/';
var request = supertest.agent(app);

describe("When the user is not authenticated", function () {
    it(`GET '${homePage}' redirects to the loginPage`, function (done) {
        var expectedURI = `/login`;

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

describe("When the user is authenticated but not yet verified", function () {
    var userFormData = ensureUnverifiedUserIsAuthenticated(request);

    it(`GET '${homePage}' gives the unverified homePage`, function (done) {
        var response = request.get(homePage);

        helpers.verifySuccess(response)
            .expect(function (res) {
                helpers.containsAllSubstrings(res.text, ['<title>Sales funnel - reporting tool - AB Inbev</title>', userFormData.username, "Please verify your account", getResendEmailUrl(getNewUserAccount()._id)])
            }).end(done);
    });

    it(`GET '${homePage}' with error shows the error on the screen`, function(done) {
        var errorText = getRandomString();
        var response = request.get(homePage + "?error=" + errorText);

        helpers.verifySuccess(response)
        .expect(function (res) {
                helpers.containsAllSubstrings(res.text, [userFormData.username, errorText])
            }).end(done);
    });

    it(`GET '${homePage}' with error shows the info on the screen`, function(done) {
        var infoText = getRandomString();
        var response = request.get(homePage + "?info=" + infoText);

        helpers.verifySuccess(response)
            .expect(function (res) {
                helpers.containsAllSubstrings(res.text, [userFormData.username, infoText])
            }).end(done);
    });
});

describe("When the user is authenticated and fully verified", function () {
    var userFormData = ensureVerifiedUserIsAuthenticated(request);

    it(`GET '${homePage}' gives the homePage`, function (done) {
        var response = request.get(homePage);

        helpers.verifySuccess(response)
            .expect(function (res) {
                helpers.containsAllSubstrings(res.text, ['<title>Sales funnel - reporting tool - AB Inbev</title>', userFormData.username, "Welcome"])
            }).end(done);
    });

    it(`GET '${homePage}' with error shows the error on the screen`, function(done) {
        var errorText = getRandomString();
        var response = request.get(homePage + "?error=" + errorText);

        helpers.verifySuccess(response)
            .expect(function (res) {
                helpers.containsAllSubstrings(res.text, [userFormData.username, errorText])
            }).end(done);
    });

    it(`GET '${homePage}' with error shows the info on the screen`, function(done) {
        var infoText = getRandomString();
        var response = request.get(homePage + "?info=" + infoText);

        helpers.verifySuccess(response)
            .expect(function (res) {
                helpers.containsAllSubstrings(res.text, [userFormData.username, infoText])
            }).end(done);
    });
});

describe("When the NSM is authenticated and fully verified", function() {
    var nationalSalesManager = getNationalSalesManager();
    var userFormData = ensureVerifiedUserIsAuthenticated(request, nationalSalesManager._id);

    it(`GET '${homePage}' gives the National Sales Manager homePage`, function(done) {
        var response = request.get(homePage);

        helpers.verifySuccess(response)
            .expect(function (res) {
                helpers.containsAllSubstrings(res.text, ['<title>Sales funnel - reporting tool - AB Inbev</title>', userFormData.username, `Welcome ${nationalSalesManager.roleName}`])
            }).end(done);
    });
});

describe("When the SM is authenticated and fully verified", function() {
    var salesManager = getSalesManager();
    var userFormData = ensureVerifiedUserIsAuthenticated(request, salesManager._id);

    it(`GET '${homePage}' gives the Sales Manager homePage`, function(done) {

        var response = request.get(homePage);

    helpers.verifySuccess(response)
        .expect(function (res) {
            helpers.containsAllSubstrings(res.text, ['<title>Sales funnel - reporting tool - AB Inbev</title>', userFormData.username, `Welcome ${salesManager.roleName}`])
        }).end(done);
    });

});

describe("When the Rep is authenticated and fully verified", function() {
    var rep = getRep();
    ensureVerifiedUserIsAuthenticated(request, rep._id);

    it(`GET '${homePage}' gives the M1 homePage`, function(done) {

    var response = request.get(homePage);
    var user = getVerifiedUserAccount();
    helpers.verifySuccess(response)
        .expect(function (res) {
            helpers.containsAllSubstrings(res.text, ['<title>Sales funnel - reporting tool - AB Inbev</title>', 'Register the sales of the day',  `Welcome ${user.userName}`])
        }).end(done);
    });

});