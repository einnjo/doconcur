'use strict';

var Topic = require('src/resources/topic/topic_model');

exports.createTopic = function *(next) {
    let newTopic = this.request.body;
    newTopic.authorId = this.req.user.id;

    this.state.topic = yield Topic.query().insert(newTopic);

    yield next;
};

exports.getTopic = function *(next) {
    let topicId;

    if (this.params.id) {
        topicId = this.params.id;
    } else if (this.state.topic) {
        topicId = this.state.topic.id;
    }

    this.state.topic = yield Topic
        .query()
        .allowEager('[author, decisions, parentTopic, subTopics]')
        .eager(this.query.include)
        .where('id', topicId)
        .first();

    yield next;
};

exports.getTopics = function *(next) {
    this.state.topics = yield Topic
        .query()
        .allowEager('[author, decisions, parentTopic, subTopics]')
        .eager(this.query.include);

    yield next;
};

exports.updateTopic = function *(next) {
    let topicUpdate = this.request.body;

    yield Topic.query()
        .patch(topicUpdate)
        .where('id', this.params.id);

    yield next;
};

exports.deleteTopic = function *() {
    yield Topic.query().delete().where('id', this.params.id);
    this.status = 204;
};


exports.topicResponse = function *() {
    if (this.state.topic) {
        this.body = {topic: this.state.topic};
    } else if (this.state.topics) {
        this.body = {topics: this.state.topics};
    }
};

exports.checkTopicPermissions = function *(next) {
    if (this.state.topic.authorId !== this.req.user.id) {
        this.throw(403);
    }

    yield next;
};
