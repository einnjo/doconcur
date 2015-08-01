'use strict';

var Model = require('moron').Model;

/**
 * @extends Model
 * @constructor
 */
function Tag() {
    Model.apply(this, arguments);
}

Model.extend(Tag);
module.exports = Tag;

Tag.tableName = 'Tags';

Tag.jsonSchema = {
    type: 'object',
    required: ['value'],
    properties: {
        id: {type: 'integer'},
        value: {type: 'string'},
        createdAt: {type: 'string', format: 'date-time'},
        updatedAt: {type: 'string', format: 'date-time'}
    }
};

Tag.relationMappings = {
    decisions: {
        relation: Model.ManyToManyRelation,
        modelClass: 'src/resources/decision/decision_model',
        join: {
            from: 'Tags.id',
            through: {
                from: 'DecisionTags.tagId',
                to: 'DecisionTags.decisionId'
            },
            to: 'Decisions.id'
        }
    }
};
