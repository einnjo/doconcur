'use strict';

var Participation = require('src/resources/participation/participation_model');
var _ = require('lodash');

exports.createParticipation = function *() {
    let participation = this.request.body;
    participation.authorId = this.req.user.id;

    participation = yield Participation.query().insert(participation);

    this.body = {participation: participation};
};

exports.getParticipation = function *() {
    let participation = yield Participation.query().where('id', this.params.id).first();
    this.body = {participation: participation};
};

exports.getParticipations = function *() {
    let participations = yield Participation.query();
    this.body = {participations: participations};
};

exports.updateParticipation = function *() {
    let participation = yield Participation.query().where('id', this.params.id).first();
    let participationUpdate = this.request.body;

    participationUpdate = yield Participation.query()
        .patch(participationUpdate)
        .where('id', '=', this.params.id);

    participation = _.assign(participation, participationUpdate);

    this.body = {participation: participation};
};

exports.deleteParticipation = function *() {
    yield Participation.query().delete().where('id', '=', this.params.id);
    this.status = 204;
};
