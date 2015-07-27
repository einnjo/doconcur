'use strict';

var comment = require('src/resources/comment/comment_handlers');
var router = require('koa-router')();
var compose = require('koa-compose');

router
    .post('/comments', compose([
        comment.createComment,
        comment.getComment,
        comment.commentResponse
    ]))
    .get('/comments/:id', compose([
        comment.getComment,
        comment.commentResponse
    ]))
    .get('/comments', compose([
        comment.getComments,
        comment.commentResponse
    ]))
    .put('/comments/:id', compose([
        comment.getComment,
        comment.checkCommentPermissions,
        comment.updateComment,
        comment.getComment,
        comment.commentResponse
    ]))
    .delete('/comments/:id', compose([
        comment.getComment,
        comment.checkCommentPermissions,
        comment.deleteComment
    ]));

module.exports = router;
