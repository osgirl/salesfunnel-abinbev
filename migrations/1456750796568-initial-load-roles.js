'use strict'
var dbSetup = require("./helpers/db-setup");
var roleFixture = require("./data/roles-dataset");

exports.up = function (next) {
    dbSetup.resetDbCollection("Role", addFixtures);
    function addFixtures() {
        dbSetup.addFixtures({Role: roleFixture}, next);
    }
};

exports.down = function (next) {
    next();
};
