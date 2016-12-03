'use strict';
const   production = require('./production'),
        development = require('./development');

module.exports = getConfig();

function getConfig() {
    if (process.env.NODE_ENV === 'production') {
        return production;
    }
    else {
        return development;
    }
}