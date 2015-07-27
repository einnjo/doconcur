'use strict';

var Participation = require('src/resources/participation/participation_model');

exports.createParticipation = function *() {
    let participation = this.request.body;
    participation.authorId = this.req.user.id;

    participation = yield Participation.query().insert(participation);

    participation = yield Participation.query().where('id', participation.id).first();

    this.body = {participation: participation};
};

exports.getParticipation = function *() {
    let participation = yield Participation
        .query()
        .allowEager('[author, decision, answer]')
        .eager(this.query.include)
        .where('id', this.params.id)
        .first();

    this.body = {participation: participation};
};

exports.getParticipations = function *() {
    let participations = yield Participation
        .query()
        .allowEager('[author, decision, answer]')
        .eager(this.query.include);

    this.body = {participations: participations};
};

exports.updateParticipation = function *() {
    let participation = yield Participation.query().where('id', this.params.id).first();
    let participationUpdate = this.request.body;

    yield Participation.query()
        .patch(participationUpdate)
        .where('id', '=', this.params.id);

    participation = yield Participation
        .query()
        .where('id', this.params.id)
        .allowEager('[author, decision, answer]')
        .eager(this.query.include)
        .first();

    this.body = {participation: participation};
};

exports.deleteParticipation = function *() {
    yield Participation.query().delete().where('id', '=', this.params.id);
    this.status = 204;
};
