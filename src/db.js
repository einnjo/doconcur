'use strict';

var config = require('node-yaml-config').load('src/config.yaml');

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

// Initialize knex with custom pg setting.
var pg = require('pg');
pg.types.setTypeParser(20, 'text', parseInt);
var Knex = require('knex');
var knex = Knex(config.db);


// Bind knex to moron's Model.
var Model = require('moron').Model;
Model.knex(knex);

// Collect all model definitions into a single container.
var models = {};

// Read model folders in dir, exclude files with extensions.
const modelFolders = fs.readdirSync(path.join(__dirname, 'resources')).filter(function (file) {
    return file.indexOf('.') === -1;
});

// Require each model file inside each model folder dynamically.
modelFolders.forEach(function (model) {
    // ./modelName/modelName_model.js
    let modelPath = path.join(__dirname, 'resources', model, model + '_model');

    try {
        // Check that model file actually exists.
        fs.statSync(modelPath + '.js');
        models[_.capitalize(model)] = require(modelPath);
    } catch(e) {
        if (e.code !== 'ENOENT') {
            throw e;
        }
    }
});


exports.models = models;
exports.knex = knex;
exports.Model = Model;
