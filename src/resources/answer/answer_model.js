'use strict';

var Model = require('moron').Model;

/**
 * @extends Model
 * @constructor
 */
function Answer() {
    Model.apply(this, arguments);
}

Model.extend(Answer);
module.exports = Answer;

Answer.tableName = 'Answers';

Answer.jsonSchema = {
    type: 'object',
    required: ['value'],
    properties: {
        id: {type: 'integer'},
        value: {type: 'string'},
        createdAt: {type: 'string', format: 'date-time'},
        updatedAt: {type: 'string', format: 'date-time'}
    }
};

Answer.relationMappings = {
    participations: {
        relation: Model.OneToManyRelation,
        modelClass: 'src/resources/participation/participation_model',
        join: {
            from: 'Answers.id',
            to: 'Participations.answerId'
        }
    }
};
