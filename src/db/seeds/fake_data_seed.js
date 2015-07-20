'use strict';

var faker = require('faker');

exports.seed = function(knex, Promise) {
    return Promise
        .all(clearTables(knex))
        .then(function () {
            return knex('Users').insert(generateUsers(1000));
        })
        .then(function () {
            return knex('Topics').insert(generateTopics(1000));
        })
        .then(function () {
            return knex('Decisions').insert(generateDecisions(1000));
        })
        .then(function () {
            return knex('Answers').insert(generateAnswers(1000));
        })
        .then(function () {
            return knex('Participations').insert(generateParticipations(1000));
        })
        .then(function () {
            return knex('Comments').insert(generateComments(1000));
        })
        .catch(function (err) {
            throw err;
        });
};


function clearTables(knexTable) {
    return ['Comments', 'Participations', 'Answers', 'Decisions', 'Topics', 'Users'].map(function (t) {
        return knexTable(t).del();
    });
}

function generateUsers(n) {
    let userObjects = [];

    for (let i = 0; i < n; i++) {
        userObjects.push({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        });
    }

    return userObjects;
}

function generateTopics(n) {
    let topicObjects = [];

    for (let i = 0; i < n; i++) {
        topicObjects.push({
            title: faker.lorem.sentence(3),
            description: faker.lorem.sentence(6),
            authorId: faker.random.number({min: 1, max: n})
        });
    }

    return topicObjects;
}

function generateDecisions(n) {
    let decisionObjects = [];

    for (let i = 0; i < n; i++) {
        decisionObjects.push({
            title: faker.lorem.sentence(3),
            description: faker.lorem.sentence(6),
            topicId: faker.random.number({min: 1, max: n}),
            authorId: faker.random.number({min: 1, max: n})
        });
    }

    return decisionObjects;
}

function generateAnswers(knexTable) {
    return [
        {value: 'yes'},
        {value: 'no'},
        {value: 'indifferent'}
    ];
}

function generateParticipations(n) {
    let participationObjects = [];

    for (let i = 0; i < n; i++) {
        participationObjects.push({
            authorId: faker.random.number({min: 1, max: n}),
            answerId: faker.random.number({min: 1, max: 3}),
            decisionId: faker.random.number({min: 1, max: 3})
        });
    }

    return participationObjects;
}

function generateComments(n) {
    let commentObjects = [];

    for (let i = 0; i < n; i++) {
        commentObjects.push({
            text: faker.lorem.sentence(6),
            authorId: faker.random.number({min: 1, max: n}),
            decisionId: faker.random.number({min: 1, max: n})
        });
    }

    return commentObjects;
}
