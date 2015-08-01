'use strict';

var Model = require('moron').Model;
var Promise = require('bluebird');
var bcrypt = require('src/libs/bcrypt');
var jwt = require('jsonwebtoken');
var config = require('node-yaml-config').load('src/config.yaml');

/**
 * @extends Model
 * @constructor
 */
function User() {
    Model.apply(this, arguments);
}

Model.extend(User);
module.exports = User;

User.tableName = 'Users';

User.prototype.hashPassword = Promise.coroutine(function *() {
    let salt = yield bcrypt.genSaltAsync(10);
    this.password = yield bcrypt.hashAsync(this.password, salt);
});

User.prototype.createTokenSync = function () {
    if (!this.id) {
        throw new Error('Can\'t sign token without id!');
    }

    this.token = jwt.sign({id: this.id}, config.jwt.secret);
};

User.jsonSchema = {
    type: 'object',
    required: ['username', 'email'],
    properties: {
        id: {type: 'integer'},
        firstName: {type: 'string', minLength: 1, maxLength: 255},
        lastName: {type: 'string', minLength: 1, maxLength: 255},
        username: {type: 'string', minLength: 1, maxLength: 255},
        email: {type: 'string', format: 'email', minLength: 1, maxLength: 255},
        isConfirmed: {type: 'boolean'},
        password: {type: 'string'},
        token: {type: 'string'},
        createdAt: {type: 'string', format: 'date-time'},
        updatedAt: {type: 'string', format: 'date-time'}
    }
};

User.relationMappings = {
    decisions: {
        relation: Model.OneToManyRelation,
        modelClass: 'src/resources/decision/decision_model',
        join: {
            from: 'Users.id',
            to: 'Decisions.authorId'
        }
    },

    participations: {
        relation: Model.OneToManyRelation,
        modelClass: 'src/resources/participation/participation_model',
        join: {
            from: 'Users.id',
            to: 'Participations.authorId'
        }
    },

    comments: {
        relation: Model.OneToManyRelation,
        modelClass: 'src/resources/comment/comment_model',
        join: {
            from: 'Users.id',
            to: 'Comments.authorId'
        }
    }
};
