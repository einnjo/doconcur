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
    topics: '/topics',
    topic: '/topics/:id'
};

// id: {type: 'integer'},
// title: {type: 'string', minLength: 1, maxLength: 255},
// description: {type: 'string', minLength: 1, maxLength: 255},
// parentTopicId: {type: ['string', 'null']},
// authorId: {type: 'string'},
// createdAt: {type: 'string', format: 'date-time'},
// updatedAt: {type: 'string', format: 'date-time'

describe('Topic routes:', function () {
    describe('POST ' + routes.topics, function () {
        describe('Users can create a topic.', function () {
            let user;
            let topic;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                topic = yield FactoryGirl.buildAsync('topic');
            });

            before(function *() {
                res = yield request.post(routes.topics)
                    .set('Authorization', t.bearerAuthString(user.token))
                    .send(topic)
                    .expect(200);
            });

            it('Response data has correct keys', function () {
                expect(res.body).to.have.property('topic');
            });

            it('Topic is persisted to the database', function *() {
                let persistedTopic = yield knex('Topics')
                    .select()
                    .where('id', res.body.topic.id)
                    .first();

                expect(persistedTopic).to.exist();
                expect(persistedTopic.authorId).to.equal(user.id);
            });
        });
    });

    describe('GET ' + routes.topic, function () {
        describe('Users can get a topic.', function () {
            let user;
            let topic;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                topic = yield FactoryGirl.createAsync('topic');
            });

            before(function *() {
                res = yield request.get(t.replaceParams(routes.topic, {id: topic.id}))
                    .set('Authorization', t.bearerAuthString(user.token))
                    .expect(200);
            });

            it('Response data has correct keys', function () {
                Object.keys(models.Topic.jsonSchema.properties).forEach(function (key) {
                    expect(res.body.topic).to.have.property(key);
                });
            });
        });
    });

    describe('GET ' + routes.topics, function () {
        describe('Users can get many topics.', function () {
            let user;
            let topic;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                topic = yield FactoryGirl.createAsync('topic');
            });

            before(function *() {
                res = yield request.get(routes.topics)
                    .set('Authorization', t.bearerAuthString(user.token))
                    .expect(200);
            });

            it('Response data is ok.', function () {
                expect(res.body.topics).be.an('array');
                expect(res.body.topics).to.have.length(1);
                Object.keys(models.Topic.jsonSchema.properties).forEach(function (key) {
                    expect(res.body.topics[0]).to.have.property(key);
                });
            });

        });
    });

    describe('PUT ' + routes.topics, function () {
        describe('Users can update a topic.', function () {
            let user;
            let topic;
            let topicUpdate;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                topic = yield FactoryGirl.createAsync('topic', {authorId: user.id});
                topicUpdate = _.cloneDeep(topic);
                topicUpdate.title = 'Changed title';
            });

            before(function *() {
                res = yield request.put(t.replaceParams(routes.topic, {id: topic.id}))
                    .set('Authorization', t.bearerAuthString(user.token))
                    .send(topicUpdate)
                    .expect(200);
            });

            it('Response data is ok.', function () {
                expect(res.body).to.have.property('topic');
                Object.keys(models.Topic.jsonSchema.properties).forEach(function (key) {
                    expect(res.body.topic).to.have.property(key);
                });
            });

            it('Model is updated in db.', function *() {
                let topicInDb = yield knex('Topics').select().where('id', topic.id).first();

                expect(topicInDb).to.exist();

                Object.keys(topicUpdate).forEach(function (key) {
                    expect(topicInDb[key]).to.equal(topicUpdate[key]);
                });
            });

        });

        describe('Users can not update topics they didn\'t author.', function () {
            let user;
            let topic;
            let topicUpdate;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                topic = yield FactoryGirl.createAsync('topic');
                topicUpdate = _.cloneDeep(topic);
                topicUpdate.title = 'Changed title';
            });

            before(function *() {
                res = yield request
                    .put(t.replaceParams(routes.topic, {id: topic.id}))
                    .set('Authorization', t.bearerAuthString(user.token))
                    .send(topicUpdate)
                    .expect(403);
            });

            it('Model in db didn\'t change.', function *() {
                let topicInDb = yield knex('Topics').select().where('id', topic.id).first();

                expect(topicInDb).to.exist();

                Object.keys(topicUpdate).forEach(function (key) {
                    expect(topicInDb[key]).to.equal(topic[key]);
                });
            });

        });
    });

    describe('DELETE ' + routes.topic, function () {
        describe('Users can delete a topic.', function () {
            let user;
            let topic;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                topic = yield FactoryGirl.createAsync('topic', {authorId: user.id});
            });

            before(function *() {
                res = yield request.del(t.replaceParams(routes.topic, {id: topic.id}))
                    .set('Authorization', t.bearerAuthString(user.token))
                    .expect(204);
            });

            it('Topic is deleted from db.', function *() {
                let topicInDb = yield knex('Topics').select().where('id', topic.id).first();
                expect(topicInDb).to.not.exist();
            });
        });

        describe('Users can not delete a topic they didn\'t author.', function () {
            let user;
            let topic;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                topic = yield FactoryGirl.createAsync('topic');
            });

            before(function *() {
                res = yield request
                    .del(t.replaceParams(routes.topic, {id: topic.id}))
                    .set('Authorization', t.bearerAuthString(user.token))
                    .expect(403);
            });

            it('Topic is not deleted from db.', function *() {
                let topicInDb = yield knex('Topics').select().where('id', topic.id).first();
                expect(topicInDb).to.exist();
            });

        });
    });
});
