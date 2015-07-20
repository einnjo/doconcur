'use strict';

var Model = require('moron').Model;

/**
 * @extends Model
 * @constructor
 */
function Topic() {
    Model.apply(this, arguments);
}

Model.extend(Topic);
module.exports = Topic;

Topic.tableName = 'Topics';

Topic.jsonSchema = {
    type: 'object',
    required: ['title', 'authorId'],
    properties: {
        id: {type: 'integer'},
        title: {type: 'string', minLength: 1, maxLength: 255},
        description: {type: 'string', minLength: 1, maxLength: 255},
        parentTopicId: {type: ['integer', 'null']},
        authorId: {type: 'integer'},
        createdAt: {type: 'string', format: 'date-time'},
        updatedAt: {type: 'string', format: 'date-time'}
    }
};

Topic.relationMappings = {
    author: {
        relation: Model.OneToOneRelation,
        modelClass: 'src/resources/user/user_model',
        join: {
            from: 'Topics.authorId',
            to: 'Users.id'
        }
    },

    decisions: {
        relation: Model.OneToManyRelation,
        modelClass: 'src/resources/decision/decision_model',
        join: {
            from: 'Topics.id',
            to: 'Decisions.topicId'
        }
    },

    parentTopic: {
        relation: Model.OneToOneRelation,
        modelClass: Topic,
        join: {
            from: 'Topics.parentTopicId',
            to: 'Topics.id'
        }
    },

    subTopics: {
        relation: Model.OneToManyRelation,
        modelClass: Topic,
        join: {
            from: 'Topics.id',
            to: 'Topics.parentTopicId'
        }
    }
};
