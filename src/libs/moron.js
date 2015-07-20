'use strict';

var knex = require('src/libs/knex');
var Model = require('moron').Model;

Model.knex(knex);

module.exports = Model;
