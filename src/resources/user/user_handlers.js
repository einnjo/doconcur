'use strict';

var User = require('src/resources/user/user_model');

exports.getUser = function *() {
    let user = yield User
        .query()
        .allowEager('[topics, decisions, participations, comments]')
        .eager(this.query.include)
        .where('id', this.params.id)
        .first();

    this.body = {user: user};
};

exports.getUsers = function *() {
    let users = yield User
        .query()
        .allowEager('[topics, decisions, participations, comments]')
        .eager(this.query.include);

    this.body = {users: users};
};
