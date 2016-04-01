import dbTestSetup from '../../model/db-test-setup.js';

export function cleanDbBefore() {
    beforeEach(function cleanDbBefore(done) {
        dbTestSetup.cleanDb(done);
    });

    afterEach(function cleanDbAfter(done) {
        dbTestSetup.cleanDb(done);
    });
}

export function fillDbBefore() {
    beforeEach(function cleanDbAndAddAllFixturesBefore(done) {
        dbTestSetup.addAllFixtures(done);
    });

    afterEach(function cleanDbAfter(done) {
        dbTestSetup.cleanDb(done);
    });
}

export function fillDbBeforeWithRegistrationData() {
    beforeEach(function cleanDbAndAddAllFixturesBefore(done) {
        dbTestSetup.addAllFixturesWithRegistrationData(done);
    });

    afterEach(function cleanDbAfter(done) {
        dbTestSetup.cleanDb(done);
    });
}