import fixtures from 'node-mongoose-fixtures';
import staticData from '../../data/config/index';
import userFixture from './user-fixture.js';
import { connectToDatabase } from '../db.js';

var isDbReady = false;

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

function addUserFixtures(callback) {
    if (!isDbReady) {
        prepareDb(doAddUserFixtures);
    } else {
        doAddUserFixtures()
    }

    function doAddUserFixtures() {
        fixtures(
            {User: userFixture},
            function (err) {
                if (err) {
                    console.log('error: ' + err)
                }
            });
        if (callback) {
            callback();
        }
    }
};

function cleanDb(callback) {
    fixtures.reset();
    if (callback) {
        callback();
    }
};

export default {
    addUserFixtures: addUserFixtures,
    cleanDb: cleanDb
};