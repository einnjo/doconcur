'use strict';

var FactoryGirl = require('src/libs/factoryGirl');

exports.seed = function(knex, Promise) {
    return Promise
        .all(clearTables(knex))
        .then(function () {
            return Promise.all(generateModels(1000, function () {
                return FactoryGirl.createAsync('user');
            }));
        })
        .then(function () {
            return Promise.all(generateModels(1000, function () {
                return FactoryGirl.createAsync('decision');
            }));
        })
        .then(function () {
            return Promise.all(generateModels(1000, function () {
                return FactoryGirl.createAsync('comment');
            }));
        })
        .then(function () {
            return Promise.all(generateModels(1000, function () {
                return FactoryGirl.createAsync('participation');
            }));
        })
        .then(function () {
            return Promise.all(generateModels(1000, function () {
                return FactoryGirl.createAsync('decisionTag');
            }));
        })
        .catch(function (err) {
            throw err;
        });
};


function clearTables(knexTable) {
    return ['Comments', 'Participations', 'Answers', 'DecisionTags', 'Tags', 'Decisions', 'Users'].map(function (t) {
        return knexTable(t).del();
    });
}

function generateModels(n, modelFunc) {
    let promises = [];

    for (let i = 0; i < n; i++) {
        promises.push(modelFunc());
    }

    return Promise.all(promises);
}
