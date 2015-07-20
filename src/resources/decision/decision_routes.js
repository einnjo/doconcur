'use strict';

var decision = require('src/resources/decision/decision_handlers');
var router = require('koa-router')();

router
    .post('/decisions', decision.createDecision)
    .get('/decisions/:id', decision.getDecision)
    .get('/decisions', decision.getDecisions)
    .put('/decisions/:id', decision.updateDecision)
    .del('/decisions/:id', decision.deleteDecision);

module.exports = router;
