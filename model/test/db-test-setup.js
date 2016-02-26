import fixtures from 'node-mongoose-fixtures';
import staticData from '../../data/config/index';
import userFixture from './user-fixture.js';
import '../db.js';

var isDbReady = false;

function prepareDb() {
    var config = staticData.getConfig();

    if (!config.db.isTestable) {
        throw new Error("Don't use this DB for testing! - " + config.db.url)
    }
    fixtures.reset();
    isDbReady = true;
}

function addUserFixtures() {
    if (!isDbReady) {
        prepareDb();
    }

    fixtures(
        {
            User: userFixture
        }, function (err) {
            if (err) {
                console.log('error: ' + err)
            }
        });
};

export default {
    addUserFixtures: addUserFixtures
};