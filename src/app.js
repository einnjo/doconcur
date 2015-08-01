'use strict';

var koa = require('koa');
var app = koa();
var koaBody = require('koa-better-body');
var passport = require('src/libs/passport');
var logger = require('koa-logger');
var router = require('koa-router')();
var AuthorizationError = require('src/errors/authorizationError');
var db = require('src/db');

app.knex = db.knex;
app.models = db.models;

app.use(logger());

app.use(koaBody({fieldsKey: false, filesKey: false}));

app.use(function *(next) {
  try {
    yield next;
  } catch (err) {
    this.status = err.status || 500;
    this.type = 'json';
    this.body = {error: {
        name: err.name || 'Error',
        message: err.message || 'Something went wrong.'
    }};
  }
});

app.use(passport.initialize());

// Require json web token for all resources routes.
['/users', '/participations', '/decisions', '/comments', '/answers'].forEach(function (path) {
    router.all(path + '*', function *(next) {
        let self = this;

        yield passport.authenticate('jwt', function *(err, user, info, status) {
            if (err) {
                throw err;
            }
            if (!user) {
                throw new AuthorizationError(401, info.message || 'Could not authorize the request.');
            }

            self.req.user = user;

            yield next;
        }).call(this, next);
    });
});

// Requires username and password auth for signin route.
router.post('/auth/signin', passport.authenticate('local', {session: false}));

app.use(router.routes());
app.use(require('src/resources/auth/auth_routes').routes());
app.use(require('src/resources/decision/decision_routes').routes());
app.use(require('src/resources/participation/participation_routes').routes());
app.use(require('src/resources/answer/answer_routes').routes());
app.use(require('src/resources/user/user_routes').routes());
app.use(require('src/resources/comment/comment_routes').routes());

module.exports = app;
