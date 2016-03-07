'use strict';
var dbSetup = require("./helpers/db-setup");
var teamFixture = require("./data/teams-dataset");

exports.up = function (next) {
    dbSetup.resetDbCollection("Team", addFixtures);
    function addFixtures() {
        dbSetup.addFixtures({Team: teamFixture}, next);
    }
};

exports.down = function(next) {
    next();
};