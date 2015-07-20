'use strict';

var Model = require('moron').Model;

/**
 * @extends Model
 * @constructor
 */
function Decision() {
    Model.apply(this, arguments);
}

Model.extend(Decision);
module.exports = Decision;

Decision.tableName = 'Decisions';

Decision.jsonSchema = {
    type: 'object',
    required: ['title', 'authorId'],
    properties: {
        id: {type: 'integer'},
        title: {type: 'string', minLength: 1, maxLength: 255},
        description: {type: 'string', minLength: 1, maxLength: 255},
        isClosed: {type: 'boolean'},
        topicId: {type: 'integer'},
        authorId: {type: 'integer'},
        closesOn: {type: 'string', format: 'date-time'},
        closedOn: {type: 'string', format: 'date-time'},
        createdAt: {type: 'string', format: 'date-time'},
        updatedAt: {type: 'string', format: 'date-time'}
    }
};

Decision.relationMappings = {
    author: {
        relation: Model.OneToOneRelation,
        modelClass: 'src/resources/user/user_model',
        join: {
            from: 'Decisions.authorId',
            to: 'Users.id'
        }
    },

    topic: {
        relation: Model.OneToOneRelation,
        modelClass: 'src/resources/topic/topic_model',
        join: {
            from: 'Decisions.topicId',
            to: 'Topics.id'
        }
    },

    participations: {
        relation: Model.OneToManyRelation,
        modelClass: 'src/resources/participation/participation_model',
        join: {
            from: 'Decisions.id',
            to: 'Participations.decisionId'
        }
    }
};
