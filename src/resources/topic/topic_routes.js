'use strict';

var topic = require('src/resources/topic/topic_handlers');
var router = require('koa-router')();
var compose = require('koa-compose');

router
    .post('/topics', compose([
        topic.createTopic,
        topic.getTopic,
        topic.topicResponse
    ]))
    .get('/topics/:id', compose([
        topic.getTopic,
        topic.topicResponse
    ]))
    .get('/topics', compose([
        topic.getTopics,
        topic.topicResponse
    ]))
    .put('/topics/:id', compose([
        topic.updateTopic,
        topic.getTopic,
        topic.topicResponse
    ]))
    .del('/topics/:id', topic.deleteTopic);

module.exports = router;
