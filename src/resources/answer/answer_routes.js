'use strict';

var answer = require('src/resources/answer/answer_handlers');
var router = require('koa-router')();

router
    .get('/answers/:id', answer.getAnswer)
    .get('/answers', answer.getAnswers);

module.exports = router;
