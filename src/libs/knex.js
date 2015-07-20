'use strict';

var Knex = require('knex');
var config = require('node-yaml-config').load('src/config.yaml');
var knex = Knex(config.db);

module.exports = knex;
