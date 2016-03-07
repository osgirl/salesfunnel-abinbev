import UserFixtures from '../../model/users/user-fixture.js';
import dbTestSetup from '../../model/db-test-setup.js';
import sinon from 'sinon';

var cryptoPbkdf2 = require("../../middleware/crypto/crypto-pbkdf2");

export const authenticatedUser = {username: UserFixtures[0].email, password: UserFixtures[0].pw};
export const authenticatedUserObject = UserFixtures[0];

export function ensureUserIsAuthenticated(server) {
    var verifyPasswordStub;

    beforeEach(function ensureUserIsAuthenticated(done) {
        verifyPasswordStub = sinon.stub(cryptoPbkdf2, 'verifyPassword', function (hashedPassword, password, callback) {
            callback(null, true);
        });

        dbTestSetup.cleanDb(addUserFixtures);

        function addUserFixtures() {
            dbTestSetup.addUserFixtures(login);
        };

        function login() {
            server
                .post('/login')
                .send(authenticatedUser)
                .expect(302)
                .end(onResponse);

            function onResponse(err, res) {
                if (err) throw err;
                done();
            }
        }
    });

    afterEach(function ensureUserIsAuthenticated(done) {
        verifyPasswordStub.restore();
        logout(cleanDb);

        function logout(callback) {
            server
                .get('/logout')
                .expect(302)
                .end(onResponse);

            function onResponse(err, res) {
                if (err) throw err;
                callback();
            }
        }

        function cleanDb() {
            dbTestSetup.cleanDb(done);
        }
    });
}

export function ensurePasswordVerificationIsSuccessful() {
    var verifyPasswordStub;
    beforeEach(function ensurePasswordVerification(done) {
        verifyPasswordStub = sinon.stub(cryptoPbkdf2, 'verifyPassword', function (hashedPassword, password, callback) {
            callback(null, true);
        });
        done();
    });

    afterEach(function ensurePasswordVerification(done) {
        verifyPasswordStub.restore();
        done();
    });
}