var userFixture = [
    {
        _id: "56d87adfe3a87534acab700a",
        userName: "test-name",
        email: "testit@test.com",
        roleRef: "NSM",
        teamRef: "W",
        pw: "testtest",
        verificationToken : "a0694a5e-fa05-4440-95f2-2facb337f940",
        isVerified: false
    },
    {
        _id: "56d8a504d7c69164afe4b734",
        userName: "anotherTestName",
        email: "another@test.com",
        roleRef: "M1",
        teamRef: "E",
        pw: "testmsqifj",
        verificationToken: "a0694a5e-fa05-4440-95f2-2facb337f930",
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