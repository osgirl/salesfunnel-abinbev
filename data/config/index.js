var staticData = {};

var getStaticData = function() {
    if (Object.keys(staticData).length === 0) {
        init();
    }
    return staticData;
};

function getConfig() {
    return getStaticData().config
}

function init() {
    staticData['config'] = require('../../config.json')[process.env.NODE_ENV || "development"];
}

module.exports = {
    getConfig: getConfig
};