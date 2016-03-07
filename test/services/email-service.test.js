import {expect, assert} from 'chai';
import { fillDbBefore} from '../helpers/db-helpers.js';
import { findById } from '../../services/user-service.js';
import { getNewUserAccount, getVerifiedUserAccount } from '../../model/users/user-fixture.js';
import { verifyEmailAndUpdateUser } from '../../services/email-service.js';
import { check } from '../helpers/chai-helpers.js';
import { getRandomUUID, getNewObjectId } from '../helpers/random-helpers.js';

describe("When the user has not yet verified his account", function () {
    var user = getNewUserAccount();

    fillDbBefore();

    it(`with the correct credentials the isVerified flag should be updated`, function (done) {
        var verificationObject = {
            userId: user._id,
            verificationToken: user.verificationToken
        };
        verifyEmailAndUpdateUser(verificationObject)
            .then(function (result) {
                check(done, function() {
                    expect(result.isVerified).to.be.true
                });
            }).catch(function (err) {
                check(done, function() {
                    assert.isNotOk('this', "should be successful:" + err);
                });
            });
    });

    it(`with the wrong user id, an error should be thrown`, function (done) {
        var verificationObject = {
            userId: getNewObjectId(),
            verificationToken: user.verificationToken
        };
        verifyEmailAndUpdateUser(verificationObject)
            .then(function (result) {
                check(done, function () {
                    assert.isNotOk('this', 'should fail in stead of be successful: ' + result);
                });
            }).catch(function (err) {
                check(done, function () {
                    expect(err).to.be.an('error');
                    expect(err.message).to.contain('User not found');
                });
            });
    });

    it(`with the wrong verificationToken, an error should be thrown`, function (done) {
        var verificationObject = {
            userId: user._id,
            verificationToken: getRandomUUID()
        };
        verifyEmailAndUpdateUser(verificationObject)
            .then(function (result) {
                check(done, function () {
                    assert.isNotOk('this', 'should fail in stead of be successful: ' + result);
                });
            }).catch(function (err) {
                check(done, function () {
                    expect(err).to.be.an('error');
                    expect(err.message).to.contain('User not found');
                });
            });
    });

});

describe("When the user has already verified his account", function () {
    var user = getVerifiedUserAccount();

    fillDbBefore();

    it(`with the correct credentials, an error should be thrown`, function (done) {
        var verificationObject = {
            userId: user._id,
            verificationToken: user.verificationToken
        };
        verifyEmailAndUpdateUser(verificationObject)
            .then(function (result) {
                check(done, function () {
                    assert.isNotOk('this', 'should fail in stead of be successful: ' + result);
                });
            }).catch(function (err) {
                check(done, function () {
                    expect(err).to.be.an('error');
                    expect(err.message).to.contain('User not found');
                });
            });
    });
});