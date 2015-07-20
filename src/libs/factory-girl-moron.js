'use strict';

var Factory = require('factory-girl');
var Adapter = Factory.Adapter;

var MoronAdapter = function () {};
MoronAdapter.prototype = new Adapter();

MoronAdapter.prototype.build = function(Model, attributes) {
    return Model.fromJson(attributes);
};

MoronAdapter.prototype.save = function(doc, Model, cb) {
    Model.query().insert(doc)
        .then(function (saved) {
            cb(null, saved);
        })
        .catch(cb);
};

MoronAdapter.prototype.destroy = function(doc, Model, cb) {
    Model.query.destroy().where('id', doc.id)
        .then(function () {
            cb();
        })
        .catch(cb);
};

var adapter = new MoronAdapter();

module.exports = function(models) {
    if (models) {
        for (var i = 0; i < models.length; i++) {
            Factory.setAdapter(adapter, models[i]);
        }
    } else {
        Factory.setAdapter(adapter);
    }

    return adapter;
};
