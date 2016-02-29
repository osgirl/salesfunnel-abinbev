import fixtures from 'node-mongoose-fixtures';
import staticData from '../data/config/index';
import userFixture from './users/user-fixture.js';
import teamFixture from './teams/team-fixture.js';
import roleFixture from './roles/role-fixture.js';
import { connectToDatabase } from './db.js';

var isDbReady = false;

function addUserFixtures(callback) {
    addFixture(function () {
            doAddFixtures({User: userFixture}, callback)
        });
};


function addTeamFixtures(callback) {
    addFixture(function () {
        doAddFixtures({Team: teamFixture}, callback)
    })
}

function addRoleFixtures(callback) {
    addFixture(function () {
        doAddFixtures({Role: roleFixture}, callback)
    });
}

function cleanDb(callback) {
    fixtures.reset();
    if (callback) {
        callback();
    }
};

/**Helper functions**/
function addFixture(callback) {
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
            cleanDb(callback);
            isDbReady = true;
        }
    }
}

function doAddFixtures(fixtureObject, callback) {
    fixtures(
        fixtureObject,
        function (err) {
            if (err) {
                console.log('error: ' + err)
            }
            if (callback) callback();
        });
}

export default {
    addUserFixtures: addUserFixtures,
    addTeamFixtures: addTeamFixtures,
    addRoleFixtures: addRoleFixtures,
    cleanDb: cleanDb
};