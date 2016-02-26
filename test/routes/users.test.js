import {expect} from 'chai';
import app from '../../app';
import supertest from 'supertest';
import SupertestHelpers from '../helpers/supertest-helpers.js'
import UserFixtures from '../../model/test/user-fixture.js';
import _ from 'lodash';
import dbTestSetup from '../../model/test/db-test-setup.js';

var request = supertest(app);
var helpers = new SupertestHelpers(['<html>', '</html>', '<body>', '</body>', '<head>', '</head>']);

describe("API GET methods", function() {

    before(function() {
        dbTestSetup.addUserFixtures();
    });

    it("GET '/users' gives the homepage", function(done) {


        var usernames = [];
        _.forEach(UserFixtures, function(UserFixture) {
           usernames.push(UserFixture.userName);
        });

        var response = request.get("/users");

        helpers.verifySuccess(response)
            .expect(function (res) {
                helpers.containsAllSubstrings(res.text, ['<title>Sales funnel - reporting tool - AB Inbev</title>', 'dit zijn alle users'], usernames)
            }).end(done);
    });
});