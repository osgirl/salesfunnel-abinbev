var migrate = require('migrate');

function loadMigrations(){
    var set = migrate.load('migrations/.migrate', 'migrations');
    set.up(function (err) {
        if (err) throw err;

        console.log('Migration completed');
    });
};

module.exports = {
    loadMigrations: loadMigrations
};