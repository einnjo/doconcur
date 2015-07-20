'use strict';

var User = require('src/resources/user/user_model');

exports.getUser = function *() {
    let user = yield User.query().where('id', this.params.id).first();
    this.body = {user: user};
};

exports.getUsers = function *() {
    let users = yield User.query();
    this.body = {users: users};
};
