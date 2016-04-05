import {expect} from 'chai';
import app from '../../app';
import TeamFixtures from '../../model/teams/team-fixture.js';
import _ from 'lodash';
import { getTeams, getTeamById, getTeamsMappedById } from '../../services/team-service.js';
import { cleanDbBefore, fillDbBefore } from '../helpers/db-helpers.js';

describe("when teams are in the database", function () {
    fillDbBefore();

    it("should return all teams", function (done) {
        getTeams()
            .then(result => verifyResult(null, result))
            .catch(err => verifyResult(err));

        function verifyResult(err, result) {
            try {
                expect(TeamFixtures.length).to.equal(result.length);
                done();
            } catch (e) {
                done(e);
            }
        }
    });

    it("should return a team by id", function (done) {
        var team = TeamFixtures[0];
        getTeamById(team._id)
            .then(result => verifyResult(null, result))
            .catch(err => verifyResult(err));

        function verifyResult(err, result) {
            try {
                expect(result.teamName).not.to.be.null;
                expect(team.teamName).to.equal(result.teamName);

                done();
            } catch (e) {
                done(e);
            }
        }
    })

    it("should return all teams mapped by id", function (done) {
        getTeamsMappedById().then(verifyResult);

        function verifyResult(result) {
            try {
                expect(TeamFixtures.length).to.equal(Object.keys(result).length);
                expect(result[TeamFixtures[0]._id].teamName).to.equal(TeamFixtures[0].teamName);
                done();
            } catch (e) {
                done(e);
            }
        }
    });
});

describe("when no teams in database", function () {
    cleanDbBefore();

    it("getTeams, should return an empty teams object", function (done) {
        getTeams()
            .then(result => verifyResult(null, result))
            .catch(err => verifyResult(err));

        function verifyResult(err, result) {
            try {
                expect(result).to.be.empty;
                expect(err).to.be.null;
                done();
            } catch (e) {
                done(e);
            }

        }
    });

    it("get all teams mapped by id, should return an empty teams object", function (done) {
        getTeamsMappedById()
            .then(result => verifyResult(null, result))
            .catch(err => verifyResult(err));

        function verifyResult(err, result) {
            try {
                expect(result).to.be.empty;
                expect(err).to.be.null;
                done();
            } catch (e) {
                done(e);
            }
        }
    });


    it("getTeamsById, should return empty team object", function (done) {
        var team = TeamFixtures[0];
        getTeamById(team._id)
            .then(result => verifyResult(null, result))
            .catch(err => verifyResult(err));

        function verifyResult(err, result) {
            try {
                expect(result).to.be.empty;
                expect(err).to.be.null;
                done();
            } catch (e) {
                done(e);
            }
        }

    })
});