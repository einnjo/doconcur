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
    comments: '/comments',
    comment: '/comments/:id'
};

// type: 'object',
// required: ['title', 'authorId'],
// properties: {
//     id: {type: 'integer'},
//     title: {type: 'string', minLength: 1, maxLength: 255},
//     description: {type: 'string', minLength: 1, maxLength: 255},
//     isClosed: {type: 'boolean'},
//     topicId: {type: 'integer'},
//     authorId: {type: 'integer'},
//     closesOn: {type: 'string', format: 'date-time'},
//     closedOn: {type: 'string', format: 'date-time'},
//     createdAt: {type: 'string', format: 'date-time'},
//     updatedAt: {type: 'string', format: 'date-time'}
// }

describe('Comment routes:', function () {
    describe('POST ' + routes.comments, function () {
        describe('Users can create a comment.', function () {
            let user;
            let comment;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                comment = yield FactoryGirl.buildAsync('comment');
            });

            before(function *() {
                res = yield request.post(routes.comments)
                    .set('Authorization', t.bearerAuthString(user.token))
                    .send(comment)
                    .expect(200);
            });

            it('Response data has correct keys', function () {
                expect(res.body).to.have.property('comment');
            });

            it('Comment is persisted to the database', function *() {
                let persistedComment = yield knex('Comments')
                    .select()
                    .where('id', res.body.comment.id)
                    .first();

                expect(persistedComment).to.exist();
                expect(persistedComment.authorId).to.equal(user.id);
            });
        });
    });

    describe('GET ' + routes.comment, function () {
        describe('Users can get a comment.', function () {
            let user;
            let comment;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                comment = yield FactoryGirl.createAsync('comment');
            });

            before(function *() {
                res = yield request.get(t.replaceParams(routes.comment, {id: comment.id}))
                    .set('Authorization', t.bearerAuthString(user.token))
                    .expect(200);
            });

            it('Response data has correct keys', function () {
                Object.keys(models.Comment.jsonSchema.properties).forEach(function (key) {
                    expect(res.body.comment).to.have.property(key);
                });
            });
        });

        describe('A comment can include it\'s author.', function () {
            let user;
            let comment;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                comment = yield FactoryGirl.createAsync('comment', {authorId: user.id});
            });

            before(function *() {
                res = yield request
                    .get(t.replaceParams(routes.comment, {id: comment.id}))
                    .query({include: 'author'})
                    .set('Authorization', t.bearerAuthString(user.token))
                    .expect(200);
            });

            it('Response data has correct keys.', function () {
                Object.keys(models.Comment.jsonSchema.properties).forEach(function (key) {
                    expect(res.body.comment).to.have.property(key);
                });
            });

            it('Includes author model in response.', function () {
                expect(res.body.comment).to.have.property('author');
                expect(res.body.comment.author).to.have.property('id');
            });
        });
    });

    describe('GET ' + routes.comments, function () {
        describe('Users can get many comments.', function () {
            let user;
            let comment;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                comment = yield FactoryGirl.createAsync('comment');
            });

            before(function *() {
                res = yield request.get(routes.comments)
                    .set('Authorization', t.bearerAuthString(user.token))
                    .expect(200);
            });

            it('Response data is ok.', function () {
                expect(res.body.comments).be.an('array');
                expect(res.body.comments).to.have.length(1);
                Object.keys(models.Comment.jsonSchema.properties).forEach(function (key) {
                    expect(res.body.comments[0]).to.have.property(key);
                });
            });
        });

        describe('Comments can include their author.', function () {
            let user;
            let comment;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                comment = yield FactoryGirl.createAsync('comment', {authorId: user.id});
            });

            before(function *() {
                res = yield request
                    .get(routes.comments)
                    .query({include: 'author'})
                    .set('Authorization', t.bearerAuthString(user.token))
                    .expect(200);
            });

            it('Response data is ok.', function () {
                expect(res.body.comments).be.an('array');
                expect(res.body.comments).to.have.length(1);
                Object.keys(models.Comment.jsonSchema.properties).forEach(function (key) {
                    expect(res.body.comments[0]).to.have.property(key);
                });
            });

            it('Includes author model in response.', function () {
                expect(res.body.comments[0]).to.have.property('author');
                expect(res.body.comments[0].author).to.have.property('id');
            });
        });
    });

    describe('PUT ' + routes.comments, function () {
        describe('Users can update a comment.', function () {
            let user;
            let comment;
            let commentUpdate;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                comment = yield FactoryGirl.createAsync('comment', {authorId: user.id});
                commentUpdate = _.cloneDeep(comment);
                commentUpdate.text = 'Updated text.';
            });

            before(function *() {
                res = yield request.put(t.replaceParams(routes.comment, {id: comment.id}))
                    .set('Authorization', t.bearerAuthString(user.token))
                    .send(commentUpdate)
                    .expect(200);
            });

            it('Response data is ok.', function () {
                expect(res.body).to.have.property('comment');
                Object.keys(models.Comment.jsonSchema.properties).forEach(function (key) {
                    expect(res.body.comment).to.have.property(key);
                });
            });

            it('Model is updated in db.', function *() {
                let commentInDb = yield knex('Comments').select().where('id', comment.id).first();

                expect(commentInDb).to.exist();

                Object.keys(commentUpdate).forEach(function (key) {
                    expect(commentInDb[key]).to.equal(commentUpdate[key]);
                });
            });
        });

        describe('Users can not update a comment they didn\'t author.', function () {
            let user;
            let comment;
            let commentUpdate;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                comment = yield FactoryGirl.createAsync('comment');
                commentUpdate = _.cloneDeep(comment);
                commentUpdate.text = 'Updated text.';
            });

            before(function *() {
                res = yield request
                    .put(t.replaceParams(routes.comment, {id: comment.id}))
                    .set('Authorization', t.bearerAuthString(user.token))
                    .send(commentUpdate)
                    .expect(403);
            });

            it('Model in db didn\'t change.', function *() {
                let commentInDb = yield knex('Comments').select().where('id', comment.id).first();

                expect(commentInDb).to.exist();

                Object.keys(commentUpdate).forEach(function (key) {
                    expect(commentInDb[key]).to.equal(comment[key]);
                });
            });

        });
    });

    describe('DELETE ' + routes.comment, function () {
        describe('Users can delete a comment.', function () {
            let user;
            let comment;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                comment = yield FactoryGirl.createAsync('comment', {authorId: user.id});
            });

            before(function *() {
                res = yield request.del(t.replaceParams(routes.comment, {id: comment.id}))
                    .set('Authorization', t.bearerAuthString(user.token))
                    .expect(204);
            });

            it('Comment is deleted from db.', function *() {
                let commentInDb = yield knex('Comments').select().where('id', comment.id).first();
                expect(commentInDb).to.not.exist();
            });
        });

        describe('Users can not delete a comment they didn\'t author.', function () {
            let user;
            let comment;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.createAsync('user');
                user.createTokenSync();
                yield models.User.query().patch({token: user.token});

                comment = yield FactoryGirl.createAsync('comment');
            });

            before(function *() {
                res = yield request.del(t.replaceParams(routes.comment, {id: comment.id}))
                    .set('Authorization', t.bearerAuthString(user.token))
                    .expect(403);
            });

            it('Comment is not deleted from db.', function *() {
                let commentInDb = yield knex('Comments').select().where('id', comment.id).first();
                expect(commentInDb).to.exist();
            });

        });
    });
});
