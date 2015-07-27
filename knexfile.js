'use strict';

var config = require('node-yaml-config').load('src/config.yaml');

var knexConfig = {};

if (process.env.NODE_ENV) {
    knexConfig[process.env.NODE_ENV] = config.db;
} else {
    knexConfig = config.db;
}

module.exports = knexConfig;
