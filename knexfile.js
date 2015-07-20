'use strict';

var config = require('node-yaml-config').load('src/config.yaml');

module.exports = config.db;
