'use strict';

var decision = require('src/resources/decision/decision_handlers');
var router = require('koa-router')();
var compose = require('koa-compose');

router
    .post('/decisions', compose([
        decision.createDecision,
        decision.getDecision,
        decision.decisionResponse
    ]))
    .get('/decisions/:id', compose([
        decision.getDecision,
        decision.decisionResponse
    ]))
    .get('/decisions', compose([
        decision.getDecisions,
        decision.decisionResponse
    ]))
    .put('/decisions/:id', compose([
        decision.getDecision,
        decision.checkDecisionPermissions,
        decision.updateDecision,
        decision.getDecision,
        decision.decisionResponse
    ]))
    .del('/decisions/:id', compose([
        decision.getDecision,
        decision.checkDecisionPermissions,
        decision.deleteDecision
    ]));

module.exports = router;
