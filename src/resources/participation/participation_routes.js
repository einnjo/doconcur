'use strict';

var handlers = require('src/resources/participation/participation_handlers');
var router = require('koa-router')();

router
    .post('/participations', handlers.createParticipation)
    .get('/participations/:id', handlers.getParticipation)
    .get('/participations', handlers.getParticipations)
    .put('/participations/:id', handlers.updateParticipation)
    .del('/participations/:id', handlers.deleteParticipation);

module.exports = router;
