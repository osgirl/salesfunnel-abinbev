import {expect} from 'chai';
import app from '../../app';
import RoleFixtures from '../../model/roles/role-fixture.js';
import _ from 'lodash';
import RoleService from '../../services/role-service.js';
import { cleanDbBefore, fillDbBefore } from '../helpers/db-helpers.js';

describe("find all roles", function () {
    fillDbBefore();

    it("should return all roles", function (done) {
        RoleService.getRoles(verifyResult);

        function verifyResult(err, result) {
            expect(RoleFixtures.length).to.equal(result.length);

            done();
        }
    });
});

describe("when no roles in database", function () {
    cleanDbBefore();

    it("should return an empty roles object", function (done) {
        RoleService.getRoles(verifyResult);

        function verifyResult(err, result) {
            expect(result).to.be.empty;
            expect(err).to.null;
            done();
        }
    });
});