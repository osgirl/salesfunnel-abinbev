import { getNewObjectId, getRandomUUID } from '../../test/helpers/random-helpers.js';

var newUserAccount = {
    _id: getNewObjectId(),
    userName: "test-name",
    email: "testit@test.com",
    roleRef: "NSM",
    teamRef: "W",
    pw: "testtest",
    verificationToken : getRandomUUID(),
    verificationEmailCounter: 0,
    isVerified: false
};
var verifiedUserAccount = {
    _id: getNewObjectId(),
    userName: "anotherTestName",
    email: "another@test.com",
    roleRef: "M1",
    teamRef: "E",
    pw: "testmsqifj",
    verificationToken: getRandomUUID(),
    verificationEmailCounter: 0,
    isVerified: true
};

var userFixture = [
    getNewUserAccount(),
    getVerifiedUserAccount()
];

export function getUserFixture() {
    return userFixture;
};

export function getNewUserAccount() {
    return newUserAccount;
}

export function getVerifiedUserAccount() {
    return verifiedUserAccount;
}

export function getNewUserAccountLoginFormData() {
    return {
        username: getNewUserAccount().email,
        password: getNewUserAccount().pw
    };
}

export function getVerifiedUserAccountLoginFormData() {
    return {
        username: getVerifiedUserAccount().email,
        password: getVerifiedUserAccount().pw
    };
}