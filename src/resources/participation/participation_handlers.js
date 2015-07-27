'use strict';

var Participation = require('src/resources/participation/participation_model');

exports.createParticipation = function *(next) {
    let newParticipation = this.request.body;
    newParticipation.authorId = this.req.user.id;

    this.state.participation = yield Participation.query().insert(newParticipation);

    yield next;
};

exports.getParticipation = function *(next) {
    let participationId;

    if (this.params.id) {
        participationId = this.params.id;
    } else if (this.state.participation) {
        participationId = this.state.participation.id;
    }

    this.state.participation = yield Participation
        .query()
        .allowEager('[author, decision, answer]')
        .eager(this.query.include)
        .where('id', participationId)
        .first();

    yield next;
};

exports.getParticipations = function *(next) {
    this.state.participations = yield Participation
        .query()
        .allowEager('[author, decision, answer]')
        .eager(this.query.include);

    yield next;
};

exports.updateParticipation = function *(next) {
    let participationUpdate = this.request.body;

    yield Participation.query()
        .patch(participationUpdate)
        .where('id', '=', this.params.id);

    yield next;
};

exports.deleteParticipation = function *() {
    yield Participation.query().delete().where('id', '=', this.params.id);
    this.status = 204;
};

exports.participationResponse = function *() {
    if (this.state.participation) {
        this.body = {participation: this.state.participation};
    } else if (this.state.participations) {
        this.body = {participations: this.state.participations};
    }
};

exports.checkParticipationPermissions = function *(next) {
    if (this.state.participation.authorId !== this.req.user.id) {
        this.throw(403);
    }

    yield next;
};
