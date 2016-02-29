import {expect} from 'chai';
import app from '../../app';
import supertest from 'supertest';
import SupertestHelpers from '../helpers/supertest-helpers.js'
import UserFixtures from '../../model/users/user-fixture.js';
import _ from 'lodash';
import dbTestSetup from '../../model/db-test-setup.js';

var request = supertest(app);
var helpers = new SupertestHelpers(['<html>', '</html>', '<body>', '</body>', '<head>', '</head>']);

describe("API GET methods success", function () {

    before(function (done) {
        dbTestSetup.addUserFixtures(done);
    });

    it("GET '/users' returns all users", function (done) {
        var usernames = [];
        _.forEach(UserFixtures, function (UserFixture) {
            usernames.push(UserFixture.userName);
        });

        var response = request.get("/users");

        helpers.verifySuccess(response)
            .expect(function (res) {
                helpers.containsAllSubstrings(res.text, ['<title>Sales funnel - reporting tool - AB Inbev</title>', 'dit zijn alle users', usernames])
            }).end(done);
    });

});

describe("API GET methods failure", function() {
    before(function (done) {
        dbTestSetup.cleanDb(done);
    });

    it("GET '/users' returns error page when DB is down", function (done) {
        request.get("/users")
            .expect(404)
            .end(done);
    });
});