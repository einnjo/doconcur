'use strict';

var user = require('src/resources/user/user_handlers');
var router = require('koa-router')();

router
    .get('/users/:id', user.getUser)
    .get('/users', user.getUsers);

module.exports = router;
