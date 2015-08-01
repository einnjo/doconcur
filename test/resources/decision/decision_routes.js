'use strict';

require('co-mocha');
var FactoryGirl = require('src/libs/factoryGirl');
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
    decisions: '/decisions',
    decision: '/decisions/:id'
};

// type: 'object',
// required: ['title', 'authorId'],
// properties: {
//     id: {type: 'integer'},
//     title: {type: 'string', minLength: 1, maxLength: 255},
//     description: {type: 'string', minLength: 1, maxLength: 255},
//     isClosed: {type: 'boolean'},
//     authorId: {type: 'integer'},
//     closesOn: {type: 'string', format: 'date-time'},
//     closedOn: {type: 'string', format: 'date-time'},
//     createdAt: {type: 'string', format: 'date-time'},
//     updatedAt: {type: 'string', format: 'date-time'}
// }

describe('Decision routes:', function () {
    describe('POST ' + routes.decisions, function () {
        describe('Users can create a decision.', function () {
            let user;
            let decision;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                decision = yield FactoryGirl.buildAsync('decision');
            });

            before(function *() {
                res = yield request.post(routes.decisions)
                    .set('Authorization', t.bearerAuthString(user.token))
                    .send(decision)
                    .expect(200);
            });

            it('Response data has correct keys', function () {
                expect(res.body).to.have.property('decision');
            });

            it('Decision is persisted to the database', function *() {
                let persistedDecision = yield knex('Decisions')
                    .select()
                    .where('id', res.body.decision.id)
                    .first();

                expect(persistedDecision).to.exist();
                expect(persistedDecision.authorId).to.equal(user.id);
            });
        });
    });

    describe('GET ' + routes.decision, function () {
        describe('Users can get a decision.', function () {
            let user;
            let decision;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                decision = yield FactoryGirl.createAsync('decision');
            });

            before(function *() {
                res = yield request.get(t.replaceParams(routes.decision, {id: decision.id}))
                    .set('Authorization', t.bearerAuthString(user.token))
                    .expect(200);
            });

            it('Response data has correct keys', function () {
                Object.keys(models.Decision.jsonSchema.properties).forEach(function (key) {
                    expect(res.body.decision).to.have.property(key);
                });
            });
        });

        describe('A decision can include it\'s author.', function () {
            let user;
            let decision;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                decision = yield FactoryGirl.createAsync('decision', {authorId: user.id});
            });

            before(function *() {
                res = yield request
                    .get(t.replaceParams(routes.decision, {id: decision.id}))
                    .set('Authorization', t.bearerAuthString(user.token))
                    .query({include: 'author'})
                    .expect(200);
            });

            it('Response data has correct keys.', function () {
                Object.keys(models.Decision.jsonSchema.properties).forEach(function (key) {
                    expect(res.body.decision).to.have.property(key);
                });
            });

            it('Includes author model in response.', function () {
                expect(res.body.decision).to.have.property('author');
                expect(res.body.decision.author.id).to.equal(user.id);
            });
        });
    });

    describe('GET ' + routes.decisions, function () {
        describe('Users can get many decisions.', function () {
            let user;
            let decision;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                decision = yield FactoryGirl.createAsync('decision');
            });

            before(function *() {
                res = yield request.get(routes.decisions)
                    .set('Authorization', t.bearerAuthString(user.token))
                    .expect(200);
            });

            it('Response data is ok.', function () {
                expect(res.body.decisions).be.an('array');
                expect(res.body.decisions).to.have.length(1);
                Object.keys(models.Decision.jsonSchema.properties).forEach(function (key) {
                    expect(res.body.decisions[0]).to.have.property(key);
                });
            });
        });

        describe('Decisions can include their author.', function () {
            let user;
            let decision;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                decision = yield FactoryGirl.createAsync('decision', {authorId: user.id});
            });

            before(function *() {
                res = yield request
                    .get(routes.decisions)
                    .set('Authorization', t.bearerAuthString(user.token))
                    .query({include: 'author'})
                    .expect(200);
            });

            it('Response data is ok.', function () {
                expect(res.body.decisions).be.an('array');
                expect(res.body.decisions).to.have.length(1);
                Object.keys(models.Decision.jsonSchema.properties).forEach(function (key) {
                    expect(res.body.decisions[0]).to.have.property(key);
                });
            });

            it('Includes author model in response.', function () {
                expect(res.body.decisions[0]).to.have.property('author');
                expect(res.body.decisions[0].author.id).to.equal(user.id);
            });
        });
    });

    describe('PUT ' + routes.decisions, function () {
        describe('Users can update a decision.', function () {
            let user;
            let decision;
            let decisionUpdate;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                decision = yield FactoryGirl.createAsync('decision', {authorId: user.id});
                decisionUpdate = _.cloneDeep(decision);
                decisionUpdate.title = 'Updated title.';
            });

            before(function *() {
                res = yield request.put(t.replaceParams(routes.decision, {id: decision.id}))
                    .set('Authorization', t.bearerAuthString(user.token))
                    .send(decisionUpdate)
                    .expect(200);
            });

            it('Response data is ok.', function () {
                expect(res.body).to.have.property('decision');
                Object.keys(models.Decision.jsonSchema.properties).forEach(function (key) {
                    expect(res.body.decision).to.have.property(key);
                });
            });

            it('Model is updated in db.', function *() {
                let decisionInDb = yield knex('Decisions').select().where('id', decision.id).first();

                expect(decisionInDb).to.exist();

                Object.keys(decisionUpdate).forEach(function (key) {
                    expect(decisionInDb[key]).to.equal(decisionUpdate[key]);
                });
            });
        });

        describe('Users can not update a decision they didn\'t author.', function () {
            let user;
            let decision;
            let decisionUpdate;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                decision = yield FactoryGirl.createAsync('decision');
                decisionUpdate = _.cloneDeep(decision);
                decisionUpdate.title = 'Updated title.';
            });

            before(function *() {
                res = yield request
                    .put(t.replaceParams(routes.decision, {id: decision.id}))
                    .set('Authorization', t.bearerAuthString(user.token))
                    .send(decisionUpdate)
                    .expect(403);
            });

            it('Model in db didn\'t change.', function *() {
                let decisionInDb = yield knex('Decisions').select().where('id', decision.id).first();

                expect(decisionInDb).to.exist();

                Object.keys(decisionUpdate).forEach(function (key) {
                    expect(decisionInDb[key]).to.equal(decision[key]);
                });
            });
        });
    });

    describe('DELETE ' + routes.decision, function () {
        describe('Users can delete a decision.', function () {
            let user;
            let decision;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                decision = yield FactoryGirl.createAsync('decision', {authorId: user.id});
            });

            before(function *() {
                res = yield request.del(t.replaceParams(routes.decision, {id: decision.id}))
                    .set('Authorization', t.bearerAuthString(user.token))
                    .expect(204);
            });

            it('Decision is deleted from db.', function *() {
                let decisionInDb = yield knex('Decisions').select().where('id', decision.id).first();
                expect(decisionInDb).to.not.exist();
            });
        });

        describe('Users can not delete a decision they didn\'t author.', function () {
            let user;
            let decision;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                decision = yield FactoryGirl.createAsync('decision');
            });

            before(function *() {
                res = yield request.del(t.replaceParams(routes.decision, {id: decision.id}))
                    .set('Authorization', t.bearerAuthString(user.token))
                    .expect(403);
            });

            it('Decision is not deleted from db.', function *() {
                let decisionInDb = yield knex('Decisions').select().where('id', decision.id).first();
                expect(decisionInDb).to.exist();
            });

        });
    });
});
