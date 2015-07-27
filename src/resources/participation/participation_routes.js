'use strict';

var handlers = require('src/resources/participation/participation_handlers');
var router = require('koa-router')();
var compose = require('koa-compose');

router
    .post('/participations', compose([
        handlers.createParticipation,
        handlers.getParticipation,
        handlers.participationResponse
    ]))
    .get('/participations/:id', compose([
        handlers.getParticipation,
        handlers.participationResponse
    ]))
    .get('/participations', compose([
        handlers.getParticipations,
        handlers.participationResponse
    ]))
    .put('/participations/:id', compose([
        handlers.updateParticipation,
        handlers.getParticipation,
        handlers.participationResponse
    ]))
    .del('/participations/:id', handlers.deleteParticipation);

module.exports = router;
