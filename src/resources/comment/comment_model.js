'use strict';

var Model = require('moron').Model;

/**
 * @extends Model
 * @constructor
 */
function Comment() {
    Model.apply(this, arguments);
}

Model.extend(Comment);
module.exports = Comment;

Comment.tableName = 'Comments';

Comment.jsonSchema = {
    type: 'object',
    required: ['text', 'decisionId', 'authorId'],
    properties: {
        id: {type: 'integer'},
        text: {type: 'string'},
        isEdited: {type: 'boolean'},
        decisionId: {type: 'integer'},
        authorId: {type: 'integer'},
        createdAt: {type: 'string', format: 'date-time'},
        updatedAt: {type: 'string', format: 'date-time'}
    }
};

Comment.relationMappings = {
    desicion: {
        relation: Model.OneToOneRelation,
        modelClass: 'src/resources/decision/decision_model',
        join: {
            from: 'Comments.decisionId',
            to: 'Decisions.id'
        }
    },

    author: {
        relation: Model.OneToOneRelation,
        modelClass: 'src/resources/user/user_model',
        join: {
            from: 'Comments.authorId',
            to: 'Users.id'
        }
    }
};
