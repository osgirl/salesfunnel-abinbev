import {expect} from 'chai';
import app from '../../app';
import UserFixtures from '../../model/users/user-fixture.js';
import _ from 'lodash';
import dbTestSetup from '../../model/db-test-setup.js';
import UserService from '../../services/user-service.js';

describe("find all users", function () {

    before(function (done) {
        dbTestSetup.addUserFixtures(done);
    });

    it("should return all users", function (done) {
        UserService.getUsers(verifyResult);

        function verifyResult(err, result) {
            expect(UserFixtures.length).to.equal(result.length);

            done();
        }
    });
});

describe("when no users in database", function() {
    before(function (done) {
        dbTestSetup.cleanDb(done);
    });

    it("should return an error", function() {
        UserService.getUsers(verifyResult);

        function verifyResult(err, result) {
            expect(result).to.be.empty;
            expect(err.status).to.equal(404);
        }
    });
});