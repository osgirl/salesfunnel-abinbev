import {expect} from 'chai';
import app from '../../app';
import TeamFixtures from '../../model/teams/team-fixture.js';
import _ from 'lodash';
import { getTeams, getTeamById } from '../../services/team-service.js';
import { cleanDbBefore, fillDbBefore } from '../helpers/db-helpers.js';

describe("when teams are in the database", function () {
    fillDbBefore();

    it("should return all teams", function (done) {
        getTeams()
            .then(result => verifyResult(null, result))
            .catch(err => verifyResult(err));

        function verifyResult(err, result) {
            expect(TeamFixtures.length).to.equal(result.length);

            done();
        }
    });

    it("should return a team by id", function (done) {
        var team = TeamFixtures[0];
        getTeamById(team._id)
            .then(result => verifyResult(null, result))
            .catch(err => verifyResult(err));

        function verifyResult(err, result) {
            expect(result.teamName).not.to.be.null;
            expect(team.teamName).to.equal(result.teamName);

            done();
        }
    })
});

describe("when no teams in database", function () {
    cleanDbBefore();

    it("should return an empty teams object", function (done) {
        getTeams()
            .then(result => verifyResult(null, result))
            .catch(err => verifyResult(err));

        function verifyResult(err, result) {
            expect(result).to.be.empty;
            expect(err).to.be.null;
            done();
        }
    });


    it("should return empty team object", function (done) {
        var team = TeamFixtures[0];
        getTeamById(team._id)
            .then(result => verifyResult(null, result))
            .catch(err => verifyResult(err));

        function verifyResult(err, result) {
            expect(result).to.be.empty;
            expect(err).to.be.null;
            done();
        }

    })
});