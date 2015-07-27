'use strict';

var Decision = require('src/resources/decision/decision_model');

exports.createDecision = function *(next) {
    let newDecision = this.request.body;
    newDecision.authorId = this.req.user.id;

    this.state.decision = yield Decision.query().insert(newDecision);

    yield next;
};

exports.getDecision = function *(next) {
    let decisionId;

    if (this.params.id) {
        decisionId = this.params.id;
    } else if (this.state.decision) {
        decisionId = this.state.decision.id;
    }

    this.state.decision = yield Decision
        .query()
        .allowEager('[author, topic, participations]')
        .eager(this.query.include)
        .where('id', decisionId)
        .first();

    yield next;
};

exports.getDecisions = function *(next) {
    this.state.decisions = yield Decision
        .query()
        .allowEager('[author, topic, participations]')
        .eager(this.query.include);

    yield next;
};

exports.updateDecision = function *(next) {
    let decisionUpdate = this.request.body;

    yield Decision.query()
        .patch(decisionUpdate)
        .where('id', this.params.id);

    this.state.decision = yield Decision
        .query()
        .allowEager('[author, topic, participations]')
        .where('id', this.params.id)
        .first();

    yield next;
};

exports.deleteDecision = function *() {
    yield Decision.query().delete().where('id', this.params.id);
    this.status = 204;
};

exports.decisionResponse = function *() {
    if (this.state.decision) {
        this.body = {decision: this.state.decision};
    } else if (this.state.decisions) {
        this.body = {decisions: this.state.decisions};
    }
};
