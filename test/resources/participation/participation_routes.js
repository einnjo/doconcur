'use strict';

require('co-mocha');
var FactoryGirl = require('src/libs/FactoryGirl');
var request = require('supertest-as-promised');
var app = require('src/app');
var models = app.models;
var knex = app.knex;
var Promise = require('bluebird');
var t = require('src/utils/test');
var chai = require('chai');
var expect = require('chai').expect;
var _ = require('lodash');

chai.use(require('dirty-chai'));

request = request(app.listen());
var routes = {
    participations: '/participations',
    participation: '/participations/:id'
};

// type: 'object',
// required: ['authorId', 'answerId', 'decisionId'],
// properties: {
//     id: {type: 'integer'},
//     authorId: {type: 'integer'},
//     answerId: {type: 'integer'},
//     decisionId: {type: 'integer'},
//     createdAt: {type: 'string', format: 'date-time'},
//     updatedAt: {type: 'string', format: 'date-time'}
// }

describe('Participation routes:', function () {
    describe('POST ' + routes.participations, function () {
        describe('Users can create a participation.', function () {
            let user;
            let participation;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                participation = yield FactoryGirl.buildAsync('participation');
            });

            before(function *() {
                res = yield request.post(routes.participations)
                    .set('Authorization', t.bearerAuthString(user.token))
                    .send(participation)
                    .expect(200);
            });

            it('Response data has correct keys', function () {
                expect(res.body).to.have.property('participation');
            });

            it('Participation is persisted to the database', function *() {
                let persistedParticipation = yield knex('Participations')
                    .select()
                    .where('id', res.body.participation.id)
                    .first();

                expect(persistedParticipation).to.exist();
                expect(persistedParticipation.authorId).to.equal(user.id);
            });
        });
    });

    describe('GET ' + routes.participation, function () {
        describe('Users can get a participation.', function () {
            let user;
            let participation;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                participation = yield FactoryGirl.createAsync('participation');
            });

            before(function *() {
                res = yield request.get(t.replaceParams(routes.participation, {id: participation.id}))
                    .set('Authorization', t.bearerAuthString(user.token))
                    .expect(200);
            });

            it('Response data has correct keys', function () {
                Object.keys(models.Participation.jsonSchema.properties).forEach(function (key) {
                    expect(res.body.participation).to.have.property(key);
                });
            });
        });
    });

    describe('GET ' + routes.participations, function () {
        describe('Users can get many participations.', function () {
            let user;
            let participation;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                participation = yield FactoryGirl.createAsync('participation');
            });

            before(function *() {
                res = yield request.get(routes.participations)
                    .set('Authorization', t.bearerAuthString(user.token))
                    .expect(200);
            });

            it('Response data is ok.', function () {
                expect(res.body.participations).be.an('array');
                expect(res.body.participations).to.have.length(1);
                Object.keys(models.Participation.jsonSchema.properties).forEach(function (key) {
                    expect(res.body.participations[0]).to.have.property(key);
                });
            });

        });
    });

    describe('PUT ' + routes.participations, function () {
        describe('Users can update a participation.', function () {
            let user;
            let participation;
            let newAnswer;
            let participationUpdate;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                newAnswer = yield FactoryGirl.createAsync('answer');

                participation = yield FactoryGirl.createAsync('participation', {authorId: user.id});
                participationUpdate = _.cloneDeep(participation);
                participationUpdate.answerId = newAnswer.id;
            });

            before(function *() {
                res = yield request.put(t.replaceParams(routes.participation, {id: participation.id}))
                    .set('Authorization', t.bearerAuthString(user.token))
                    .send(participationUpdate)
                    .expect(200);
            });

            it('Response data is ok.', function () {
                expect(res.body).to.have.property('participation');
                Object.keys(models.Participation.jsonSchema.properties).forEach(function (key) {
                    expect(res.body.participation).to.have.property(key);
                });
            });

            it('Model is updated in db.', function *() {
                let participationInDb = yield knex('Participations').select().where('id', participation.id).first();

                expect(participationInDb).to.exist();

                Object.keys(participationUpdate).forEach(function (key) {
                    expect(participationInDb[key]).to.equal(participationUpdate[key]);
                });
            });
        });

        describe('Users can not update a participation they didn\'t author.', function () {
            let user;
            let participation;
            let newAnswer;
            let participationUpdate;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                newAnswer = yield FactoryGirl.createAsync('answer');

                participation = yield FactoryGirl.createAsync('participation');
                participationUpdate = _.cloneDeep(participation);
                participationUpdate.answerId = newAnswer.id;
            });

            before(function *() {
                res = yield request
                    .put(t.replaceParams(routes.participation, {id: participation.id}))
                    .set('Authorization', t.bearerAuthString(user.token))
                    .send(participationUpdate)
                    .expect(403);
            });

            it('Model in db didn\'t change.', function *() {
                let participationInDb = yield knex('Participations').select().where('id', participation.id).first();

                expect(participationInDb).to.exist();

                Object.keys(participationUpdate).forEach(function (key) {
                    expect(participationInDb[key]).to.equal(participation[key]);
                });
            });
        });
    });

    describe('DELETE ' + routes.participation, function () {
        describe('Users can delete a participation.', function () {
            let user;
            let participation;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                participation = yield FactoryGirl.createAsync('participation', {authorId: user.id});
            });

            before(function *() {
                res = yield request.del(t.replaceParams(routes.participation, {id: participation.id}))
                    .set('Authorization', t.bearerAuthString(user.token))
                    .expect(204);
            });

            it('Participation is deleted from db.', function *() {
                let participationInDb = yield knex('Participations').select().where('id', participation.id).first();
                expect(participationInDb).to.not.exist();
            });

        });

        describe('Users can not delete a participation they didn\'t author.', function () {
            let user;
            let participation;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                participation = yield FactoryGirl.createAsync('participation');
            });

            before(function *() {
                res = yield request
                    .del(t.replaceParams(routes.participation, {id: participation.id}))
                    .set('Authorization', t.bearerAuthString(user.token))
                    .expect(403);
            });

            it('Participation is deleted from db.', function *() {
                let participationInDb = yield knex('Participations').select().where('id', participation.id).first();
                expect(participationInDb).to.exist();
            });

        });
    });
});
