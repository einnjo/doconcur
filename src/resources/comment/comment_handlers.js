'use strict';

var Comment = require('src/resources/comment/comment_model');

exports.createComment = function *(next) {
    let newComment = this.request.body;
    newComment.authorId = this.req.user.id;

    this.state.comment = yield Comment.query().insert(newComment);

    yield next;
};

exports.getComment = function *(next) {
    let commentId;

    if (this.params.id) {
        commentId = this.params.id;
    } else if (this.state.comment) {
        commentId = this.state.comment.id;
    }

    this.state.comment = yield Comment
        .query()
        .allowEager('[author, decision]')
        .eager(this.query.include)
        .where('id', commentId)
        .first();

    yield next;
};

exports.getComments = function *(next) {
    this.state.comments = yield Comment
        .query()
        .allowEager('[author, decision]')
        .eager(this.query.include);

    yield next;
};

exports.updateComment = function *(next) {
    let commentUpdate = this.request.body;

    yield Comment.query()
        .patch(commentUpdate)
        .where('id', this.params.id);

    yield next;
};

exports.deleteComment = function *() {
    yield Comment.query().delete().where('id', this.params.id);
    this.status = 204;
};

exports.commentResponse = function *() {
    if (this.state.comment) {
        this.body = {comment: this.state.comment};
    } else if (this.state.comments) {
        this.body = {comments: this.state.comments};
    }
};

exports.checkCommentPermissions = function *(next) {
    if (this.state.comment.authorId !== this.req.user.id) {
        this.throw(403);
    }

    yield next;
};
