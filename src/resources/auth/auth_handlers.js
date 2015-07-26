'use strict';

var User = require('src/resources/user/user_model');

exports.signup = function *() {
    let user;

    user =  User.fromJson(this.request.body);

    yield user.hashPassword();

    user = yield User.query().insert(user);

    user.createTokenSync();
    user = yield User.query().patch({token: user.token}).where('id', user.id);

    user = yield User.query().where('id', user.id).first();

    this.body = user;
};

exports.signin = function *() {
    this.body = {token: this.req.user.token};
};
