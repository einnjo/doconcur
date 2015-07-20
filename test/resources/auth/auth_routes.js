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
    signup: '/auth/signup',
    signin: '/auth/signin'
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

describe('Auth routes:', function () {
    describe('POST ' + routes.signup, function () {
        describe('Users can signup.', function () {
            let user;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                user = yield FactoryGirl.buildAsync('user');
            });

            before(function *() {
                res = yield request.post(routes.signup)
                    .send(user)
                    .expect(200);
            });

            it('Response data has correct keys', function () {
                expect(res.body).to.have.property('token');
            });

            it('User is persisted to the database', function *() {
                let persistedUser = yield knex('Users')
                    .select()
                    .where('token', res.body.token)
                    .first();

                expect(persistedUser).to.exist();
            });
        });
    });

    describe('POST ' + routes.signin, function () {
        describe('Users can signin.', function () {
            let user;
            let credentials;
            let res;

            t.purgeTablesBefore(knex);

            before(function *() {
                let password = 'querty';

                user = yield FactoryGirl.createAsync('user', {password: password});
                user.createTokenSync();
                yield user.hashPassword();

                yield models.User.query().patch({token: user.token, password: user.password});

                credentials = {
                    username: user.email,
                    password: password
                };
            });

            before(function *() {
                res = yield request.post(routes.signin)
                    .send(credentials)
                    .expect(200);
            });

            it('Response data has correct keys', function *() {
                expect(res.body).to.have.property('token');

                let userInDb = yield knex('Users').where({email: user.email}).first();
                expect(res.body.token).to.equal(userInDb.token);
            });
        });
    });
});
