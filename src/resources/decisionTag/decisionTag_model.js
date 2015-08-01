'use strict';

var Model = require('moron').Model;

/**
 * @extends Model
 * @constructor
 */
function DecisionTag() {
    Model.apply(this, arguments);
}

Model.extend(DecisionTag);
module.exports = DecisionTag;

DecisionTag.tableName = 'DecisionTags';

DecisionTag.jsonSchema = {
    type: 'object',
    required: ['decisionId', 'tagId'],
    properties: {
        id: {type: 'integer'},
        decisionId: {type: 'integer'},
        tagId: {type: 'integer'},
        createdAt: {type: 'string', format: 'date-time'},
        updatedAt: {type: 'string', format: 'date-time'}
    }
};

DecisionTag.relationMappings = {
    decision: {
        relation: Model.OneToOneRelation,
        modelClass: 'src/resources/decision/decision_model',
        join: {
            from: 'DecisionTags.decisionId',
            to: 'Decisions.id'
        }
    },
    tag: {
        relation: Model.OneToOneRelation,
        modelClass: 'src/resources/tag/tag_model',
        join: {
            from: 'DecisionTags.tagId',
            to: 'Tags.id'
        }
    }
};
