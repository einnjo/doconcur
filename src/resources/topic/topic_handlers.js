'use strict';

var Topic = require('src/resources/topic/topic_model');
var _ = require('lodash');

exports.createTopic = function *() {
    let topic = this.request.body;
    topic.authorId = this.req.user.id;

    topic = yield Topic.query().insert(topic);

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

    topicUpdate = yield Topic.query()
        .patch(topicUpdate)
        .where('id', this.params.id);

    topic = _.assign(topic, topicUpdate);

    this.body = {topic: topic};
};

exports.deleteTopic = function *() {
    yield Topic.query().delete().where('id', this.params.id);
    this.status = 204;
};
