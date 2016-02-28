import {expect} from 'chai';
import app from '../../app';
import supertest from 'supertest';
import SupertestHelpers from '../helpers/supertest-helpers.js'
import TeamFixtures from '../../model/teams/team-fixture.js';
import RoleFixtures from '../../model/roles/role-fixture.js';
import _ from 'lodash';
import dbTestSetup from '../../model/db-test-setup.js';

var request = supertest(app);
var helpers = new SupertestHelpers(['<html>', '</html>', '<body>', '</body>', '<head>', '</head>']);

describe("API GET methods", function () {

    before(function (done) {
        dbTestSetup.addTeamFixtures(
            dbTestSetup.addRoleFixtures(done)
        );
    });

    it("GET '/' gives the homepage", function (done) {
        var roleNames = [];
        var teamNames = [];

        _.forEach(TeamFixtures, function (TeamFixture) {
            teamNames.push(TeamFixture.teamName);
        });
        _.forEach(RoleFixtures, function (RoleFixture) {
            roleNames.push(RoleFixture.roleName);
        });
        var reponse = request.get("/");

        helpers.verifySuccess(reponse)
            .expect(function (res) {
                helpers.containsAllSubstrings(res.text, ['<title>Sales funnel - reporting tool - AB Inbev</title>', roleNames, teamNames])
            }).end(done);
    });
});