'use strict';

var Answer = require('src/resources/answer/answer_model');

exports.getAnswer = function *() {
    let answer = yield Answer.query().where('id', this.params.id).first();
    this.body = {answer: answer};
};

exports.getAnswers = function *() {
    let answers = yield Answer.query();
    this.body = {answers: answers};
};
