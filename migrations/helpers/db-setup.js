var fixtures = require("node-mongoose-fixtures");
var mongoose = require("mongoose");
function addFixtures(fixtureObject, callback) {
    fixtures(
        fixtureObject,
        function (err) {
            if (err) {
                console.log('error: ' + err)
            }
            if (callback) callback();
        });
}

function resetDbCollection(modelName, callback) {
    fixtures.reset(modelName, mongoose, callback)
}

module.exports = {
    resetDbCollection: resetDbCollection,
    addFixtures: addFixtures
};
