'use strict';

var expect = require('chai').expect();

exports.purgeTablesBefore = function purgeTablesBefore(knex) {
    before(function *() {
        yield knex.raw('TRUNCATE TABLE "Answers", "Comments", "Decisions", "Participations", "Topics", "Users"');
    });
};

exports.bearerAuthString = function bearerAuthString(token) {
    return 'Bearer ' + token;
};

exports.replaceParams = function replaceParams(url, params) {
    let regex;
    let urlWithParams = url;

    Object.keys(params).forEach(function (key) {
        regex = new RegExp(':' + key, 'g');
        urlWithParams = urlWithParams.replace(regex, params[key]);
    });

    return urlWithParams;
};
