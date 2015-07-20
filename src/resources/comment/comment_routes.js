'use strict';

var comment = require('src/resources/comment/comment_handlers');
var router = require('koa-router')();

router
    .post('/comments', comment.createComment)
    .get('/comments/:id', comment.getComment)
    .get('/comments', comment.getComments)
    .put('/comments/:id', comment.updateComment)
    .delete('/comments/:id', comment.deleteComment);

module.exports = router;
