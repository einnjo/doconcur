'use strict';

var Model = require('moron').Model;

/**
 * @extends Model
 * @constructor
 */
function Participation() {
    Model.apply(this, arguments);
}

Model.extend(Participation);
module.exports = Participation;

Participation.tableName = 'Participations';

Participation.jsonSchema = {
    type: 'object',
    required: ['authorId', 'answerId', 'decisionId'],
    properties: {
        id: {type: 'integer'},
        authorId: {type: 'integer'},
        answerId: {type: 'integer'},
        decisionId: {type: 'integer'},
        createdAt: {type: 'string', format: 'date-time'},
        updatedAt: {type: 'string', format: 'date-time'}
    }
};

Participation.relationMappings = {
    author: {
        relation: Model.OneToOneRelation,
        modelClass: 'src/resources/user/user_model',
        join: {
            from: 'Participations.authorId',
            to: 'Users.id'
        }
    },

    decision: {
        relation: Model.OneToOneRelation,
        modelClass: 'src/resources/decision/decision_model',
        join: {
            from: 'Participations.decisionId',
            to: 'Decisions.id'
        }
    },

    answer: {
        relation: Model.OneToOneRelation,
        modelClass: 'src/resources/answer/answer_model',
        join: {
            from: 'Participations.answerId',
            to: 'Answers.id'
        }
    }
};
