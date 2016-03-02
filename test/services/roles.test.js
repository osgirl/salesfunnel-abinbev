import {expect} from 'chai';
import app from '../../app';
import RoleFixtures from '../../model/roles/role-fixture.js';
import _ from 'lodash';
import dbTestSetup from '../../model/db-test-setup.js';
import RoleService from '../../services/role-service.js';

describe("find all roles", function () {

    before(function (done) {
        dbTestSetup.addRoleFixtures(done);
    });

    it("should return all roles", function (done) {
        RoleService.getRoles(verifyResult);

        function verifyResult(err, result) {
            expect(RoleFixtures.length).to.equal(result.length);

            done();
        }
    });
});

describe("when no roles in database", function() {
    before(function (done) {
        dbTestSetup.cleanDb(done);
    });

    it("should return an an empty roles object", function() {
        RoleService.getRoles(verifyResult);

        function verifyResult(err, result) {
            expect(result).to.be.empty;
            expect(err).to.null;
        }
    });
});