'use strict';

var passport = require('koa-passport');
var JwtStrategy = require('passport-jwt').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var User = require('src/resources/user/user_model');
var Promise = require('bluebird');
var bcrypt = require('src/libs/bcrypt');
var AuthorizationError = require('src/errors/authorizationError');
var config = require('node-yaml-config').load('src/config.yaml');

passport.use('jwt', new JwtStrategy({
    secretOrKey: config.jwt.secret,
    tokenBodyField: 'token',
    tokenQueryParameterName: 'token',
    authScheme: 'Bearer'
}, Promise.coroutine(function * (payload, done) {
    let user = yield User.query().where('id', payload.id).first();

    if (!user) {
        return done(new AuthorizationError(401, 'Invalid token.'));
    }

    return done(null, user);
})));

passport.use('local', new LocalStrategy({
    session: false,
    passReqToCallback: true
}, Promise.coroutine(function * (req, username, password, done) {
    let user;

    if (username.indexOf('@') === -1) {
        user = yield User.query().where('username', username).first();
    } else {
        user = yield User.query().where('email', username).first();
    }

    if (!user) {
        return done(new AuthorizationError(401, 'Invalid username.'));
    }

    let hash = user.password;

    let passwordMatches = yield bcrypt.compareAsync(password, hash);

    if (passwordMatches) {
        return done(null, user);
    }

    return done(new AuthorizationError(401, 'Invalid password.'));
})));

module.exports = passport;
