'use strict';

var Topic = require('src/resources/topic/topic_model');

exports.createTopic = function *() {
    let topic = this.request.body;
    topic.authorId = this.req.user.id;

    topic = yield Topic.query().insert(topic);

    topic = yield Topic.query().where('id', topic.id).first();

    this.body = {topic: topic};
};

exports.getTopic = function *() {
    let topic = yield Topic.query().where('id', this.params.id).first();
    this.body = {topic: topic};
};

exports.getTopics = function *() {
    let topics = yield Topic.query();
    this.body = {topics: topics};
};

exports.updateTopic = function *() {
    let topic = yield Topic.query().where('id', this.params.id).first();
    let topicUpdate = this.request.body;

    yield Topic.query()
        .patch(topicUpdate)
        .where('id', this.params.id);

    topic = yield Topic.query().where('id', this.params.id).first();

    this.body = {topic: topic};
};

exports.deleteTopic = function *() {
    yield Topic.query().delete().where('id', this.params.id);
    this.status = 204;
};
