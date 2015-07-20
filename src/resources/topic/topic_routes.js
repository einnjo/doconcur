'use strict';

var topic = require('src/resources/topic/topic_handlers');
var router = require('koa-router')();

router
    .post('/topics', topic.createTopic)
    .get('/topics/:id', topic.getTopic)
    .get('/topics', topic.getTopics)
    .put('/topics/:id', topic.updateTopic)
    .del('/topics/:id', topic.deleteTopic);

module.exports = router;
