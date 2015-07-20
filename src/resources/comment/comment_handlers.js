'use strict';

var Comment = require('src/resources/comment/comment_model');
var _ = require('lodash');

exports.createComment = function *() {
    let comment = this.request.body;
    comment.authorId = this.req.user.id;

    comment = yield Comment.query().insert(comment);

    this.body = {comment: comment};
};

exports.getComment = function *() {
    let comment = yield Comment.query().where('id', this.params.id).first();
    this.body = {comment: comment};
};

exports.getComments = function *() {
    let comments = yield Comment.query();
    this.body = {comments: comments};
};

exports.updateComment = function *() {
    let comment = yield Comment.query().where('id', this.params.id).first();
    let commentUpdate = this.request.body;

    let updatedComment = yield Comment.query()
        .patch(commentUpdate)
        .where('id', this.params.id);

    comment = _.assign(comment, updatedComment);

    this.body = {comment: comment};
};

exports.deleteComment = function *() {
    yield Comment.query().delete().where('id', this.params.id);
    this.status = 204;
};
