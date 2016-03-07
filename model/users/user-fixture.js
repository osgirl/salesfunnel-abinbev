import { getNewObjectId, getRandomUUID } from '../../test/helpers/random-helpers.js';

var userFixture = [
    {
        _id: getNewObjectId(),
        userName: "test-name",
        email: "testit@test.com",
        roleRef: "NSM",
        teamRef: "W",
        pw: "testtest",
        verificationToken : getRandomUUID(),
        verificationEmailCounter: 0,
        isVerified: false
    },
    {
        _id: getNewObjectId(),
        userName: "anotherTestName",
        email: "another@test.com",
        roleRef: "M1",
        teamRef: "E",
        pw: "testmsqifj",
        verificationToken: getRandomUUID(),
        verificationEmailCounter: 0,
        isVerified: true
    }
];

export default userFixture;

export function getNewUserAccount() {
    return userFixture[0];
}

export function getVerifiedUserAccount() {
    return userFixture[1];
}