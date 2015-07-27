'use strict';

var Decision = require('src/resources/decision/decision_model');

exports.createDecision = function *() {
    let decision = this.request.body;
    decision.authorId = this.req.user.id;

    decision = yield Decision.query().insert(decision);

    decision = yield Decision.query().where('id', decision.id).first();

    this.body = {decision: decision};
};

exports.getDecision = function *() {
    let decision = yield Decision
        .query()
        .allowEager('[author, topic, participations]')
        .eager(this.query.include)
        .where('id', this.params.id)
        .first();

    this.body = {decision: decision};
};

exports.getDecisions = function *() {
    let decisions = yield Decision
        .query()
        .allowEager('[author, topic, participations]')
        .eager(this.query.include);

    this.body = {decisions: decisions};
};

exports.updateDecision = function *() {
    let decision = yield Decision.query().where('id', this.params.id).first();
    let decisionUpdate = this.request.body;

    yield Decision.query()
        .patch(decisionUpdate)
        .where('id', this.params.id);

    decision = yield Decision
        .query()
        .allowEager('[author, topic, participations]')
        .where('id', this.params.id)
        .first();

    this.body = {decision: decision};
};

exports.deleteDecision = function *() {
    yield Decision.query().delete().where('id', this.params.id);
    this.status = 204;
};
