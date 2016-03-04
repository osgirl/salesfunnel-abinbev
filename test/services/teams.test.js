import {expect} from 'chai';
import app from '../../app';
import TeamFixtures from '../../model/teams/team-fixture.js';
import _ from 'lodash';
import TeamService from '../../services/team-service.js';
import { cleanDbBefore, fillDbBefore } from '../helpers/db-helpers.js';

describe("find all teams", function () {
    fillDbBefore();

    it("should return all teams", function (done) {
        TeamService.getTeams(verifyResult);

        function verifyResult(err, result) {
            expect(TeamFixtures.length).to.equal(result.length);

            done();
        }
    });
});

describe("when no teams in database", function() {
    cleanDbBefore();

    it("should return an empty teams object", function() {
        TeamService.getTeams(verifyResult);

        function verifyResult(err, result) {
            expect(result).to.be.empty;
            expect(err).to.be.null;
        }
    });
});