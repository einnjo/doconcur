'use strict';

var Comment = require('src/resources/comment/comment_model');

exports.createComment = function *() {
    let comment = this.request.body;
    comment.authorId = this.req.user.id;

    comment = yield Comment.query().insert(comment);

    comment = yield Comment.query().where('id', comment.id).first();

    this.body = {comment: comment};
};

exports.getComment = function *() {
    let comment = yield Comment
        .query()
        .allowEager('[author, decision]')
        .eager(this.query.include)
        .where('id', this.params.id).first();

    this.body = {comment: comment};
};

exports.getComments = function *() {
    let comments = yield Comment
        .query()
        .allowEager('[author, decision]')
        .eager(this.query.include);

    this.body = {comments: comments};
};

exports.updateComment = function *() {
    let comment = yield Comment.query().where('id', this.params.id).first();
    let commentUpdate = this.request.body;

    yield Comment.query()
        .patch(commentUpdate)
        .where('id', this.params.id);

    comment = yield Comment
        .query()
        .allowEager('[author, decision]')
        .where('id', this.params.id)
        .first();

    this.body = {comment: comment};
};

exports.deleteComment = function *() {
    yield Comment.query().delete().where('id', this.params.id);
    this.status = 204;
};
