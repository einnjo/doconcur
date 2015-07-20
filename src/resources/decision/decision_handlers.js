'use strict';

var Decision = require('src/resources/decision/decision_model');
var _ = require('lodash');

exports.createDecision = function *() {
    let decision = this.request.body;
    decision.authorId = this.req.user.id;

    decision = yield Decision.query().insert(decision);

    this.body = {decision: decision};
};

exports.getDecision = function *() {
    let decision = yield Decision.query().where('id', this.params.id).first();
    this.body = {decision: decision};
};

exports.getDecisions = function *() {
    let decisions = yield Decision.query();
    this.body = {decisions: decisions};
};

exports.updateDecision = function *() {
    let decision = yield Decision.query().where('id', this.params.id).first();
    let decisionUpdate = this.request.body;

    let updatedDecision = yield Decision.query()
        .patch(decisionUpdate)
        .where('id', this.params.id);

    decision = _.assign(decision, updatedDecision);

    this.body = {decision: decision};
};

exports.deleteDecision = function *() {
    yield Decision.query().delete().where('id', this.params.id);
    this.status = 204;
};
