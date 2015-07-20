'use strict';

var auth = require('src/resources/auth/auth_handlers');
var router = require('koa-router')();

router
    .post('/auth/signup', auth.signup)
    .post('/auth/signin', auth.signin);

module.exports = router;
