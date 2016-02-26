import config from '../../config.json'

var staticData = {};

var getStaticData = function() {
    if (Object.keys(staticData).length === 0) {
        init();
    }
    return staticData;
};

var getConfig = function() {
    return getStaticData().config;
}

function init() {
    staticData['config'] = config[process.env.NODE_ENV || "development"];
}

export default {
    getConfig : getConfig
}