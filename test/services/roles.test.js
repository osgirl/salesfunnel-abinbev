import {expect} from 'chai';
import app from '../../app';
import RoleFixtures from '../../model/roles/role-fixture.js';
import _ from 'lodash';
import { getRoles, getRolesMappedById } from '../../services/role-service.js';
import { cleanDbBefore, fillDbBefore } from '../helpers/db-helpers.js';

describe("when roles in database", function () {
    fillDbBefore();

    it("find all roles, should return all roles", function (done) {
        getRoles().then(verifyResult);

        function verifyResult(result) {
            try {
                expect(RoleFixtures.length).to.equal(result.length);
                done();
            } catch (e) {
                done(e);
            }

        }
    });

    it("find all roles mapped by id, should return all roles mapped by id", function (done) {
        getRolesMappedById().then(verifyResult);

        function verifyResult(result) {
            try {
                expect(RoleFixtures.length).to.equal(Object.keys(result).length);
                expect(result[RoleFixtures[0]._id].roleName).to.equal(RoleFixtures[0].roleName);
                done();
            } catch (e) {
                done(e);
            }
        }
    });
});

describe("when no roles in database", function () {
    cleanDbBefore();

    it("get all roles, should return an empty roles object", function (done) {
        getRoles().then(verifyResult);

        function verifyResult(result) {
            try {
                expect(result).to.be.empty;
                done();
            } catch (e) {
                done(e);
            }
        }
    });

    it("get all roles mapped by id, should return an empty roles object", function (done) {
        getRolesMappedById().then(verifyResult);

        function verifyResult(result) {
            try {
                expect(result).to.be.empty;
                done();
            } catch (e) {
                done(e);
            }
        }
    });
});