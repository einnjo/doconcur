'use strict';

var participation = require('src/resources/participation/participation_handlers');
var router = require('koa-router')();
var compose = require('koa-compose');

router
    .post('/participations', compose([
        participation.createParticipation,
        participation.getParticipation,
        participation.participationResponse
    ]))
    .get('/participations/:id', compose([
        participation.getParticipation,
        participation.participationResponse
    ]))
    .get('/participations', compose([
        participation.getParticipations,
        participation.participationResponse
    ]))
    .put('/participations/:id', compose([
        participation.getParticipation,
        participation.checkParticipationPermissions,
        participation.updateParticipation,
        participation.getParticipation,
        participation.participationResponse
    ]))
    .del('/participations/:id', compose([
        participation.getParticipation,
        participation.checkParticipationPermissions,
        participation.deleteParticipation
    ]));

module.exports = router;
