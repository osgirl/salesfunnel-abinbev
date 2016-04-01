import fixtures from 'node-mongoose-fixtures';
import staticData from '../data/config/index';
import { getUserFixture } from './users/user-fixture.js';
import { getRegistrationFixture } from './registration/registration-fixture.js';
import teamFixture from './teams/team-fixture.js';
import registrationFixture from './registration/registration-fixture.js';
import roleFixture from './roles/role-fixture.js';
import { connectToDatabase } from './db.js';

var isDbReady = false;

function addUserFixtures(callback) {
    addDbAction(function () {
            doAddFixtures({Team: teamFixture, Role: roleFixture, User: getUserFixture()}, callback)
        });
};

function addAllFixtures(callback) {
    addDbAction(function () {
            doAddFixtures({Team: teamFixture, Role: roleFixture, User: getUserFixture()}, callback)
        });
};

function addAllFixturesWithRegistrationData(callback) {
    addDbAction(function () {
            doAddFixtures({Team: teamFixture, Role: roleFixture, User: getUserFixture(), Registration: getRegistrationFixture()}, callback)
        });
};

function addTeamFixtures(callback) {
    addDbAction(function () {
        doAddFixtures({Team: teamFixture}, callback)
    })
}

function addRoleFixtures(callback) {
    addDbAction(function () {
        doAddFixtures({Role: roleFixture}, callback)
    });
}

function cleanDb(callback) {
    addDbAction(doCleanDb);

    function doCleanDb() {
        fixtures.reset();
        if (callback) {
            callback();
        }
    }
};

/**Helper functions**/
function addDbAction(callback) {
    if (!isDbReady) {
        prepareDb(callback);
    } else {
        callback();
    }

    function prepareDb(callback) {
        connectToDatabase(doPrepareDb);

        function doPrepareDb() {
            var config = staticData.getConfig();

            if (!config.db.isTestable) {
                throw new Error("Don't use this DB for testing! - " + config.db.url)
            }
            isDbReady = true;
            callback();
        }
    }
}

function doAddFixtures(fixtureObject, callback) {
    fixtures(
        fixtureObject,
        function (err) {
            if (err) {
                callback(err)
            }
            if (callback) callback();
        });
}

export default {
    addUserFixtures: addUserFixtures,
    addTeamFixtures: addTeamFixtures,
    addRoleFixtures: addRoleFixtures,
    addAllFixtures: addAllFixtures,
    addAllFixturesWithRegistrationData: addAllFixturesWithRegistrationData,
    cleanDb: cleanDb
};