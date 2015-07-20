'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var models = {};

// Read model folders in dir, exclude files with extensions.
const modelFolders = fs.readdirSync(__dirname).filter(file => file.indexOf('.') === -1);

// Require each model file inside each model folder dynamically.
modelFolders.forEach(function (model) {
    // ./modelName/modelName_model.js
    let modelPath = path.join(__dirname, model, model + '_model');

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

module.exports = models;
