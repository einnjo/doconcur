'use strict';

exports.up = function (knex) {
    return knex.schema
        .createTable('Users', function (table) {
            table.bigincrements('id').primary();
            table.string('firstName');
            table.string('lastName');
            table.string('username');
            table.string('email').notNullable();
            table.boolean('isConfirmed').defaultTo(false);
            table.string('password');
            table.string('token');
            table.timestamp('createdAt').defaultTo(knex.raw('now()'));
            table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
        })
        .createTable('Decisions', function (table) {
            table.bigincrements('id').primary();
            table.string('title').notNullable();
            table.string('description');
            table.boolean('isClosed').defaultsTo(false);
            table.biginteger('authorId').unsigned().references('id').inTable('Users').onDelete('cascade');
            table.timestamp('closesOn');
            table.timestamp('closedOn');
            table.timestamp('createdAt').defaultTo(knex.raw('now()'));
            table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
        })
        .createTable('Tags', function (table) {
            table.bigincrements('id').primary();
            table.string('value').notNullable();
            table.timestamp('createdAt').defaultTo(knex.raw('now()'));
            table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
        })
        .createTable('DecisionTags', function (table) {
            table.bigincrements('id').primary();
            table.biginteger('decisionId').unsigned().references('id').inTable('Decisions').onDelete('cascade');
            table.biginteger('tagId').unsigned().references('id').inTable('Tags').onDelete('cascade');
            table.timestamp('createdAt').defaultTo(knex.raw('now()'));
            table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
        })
        .createTable('Answers', function (table) {
            table.bigincrements('id').primary();
            table.string('value').notNullable();
            table.timestamp('createdAt').defaultTo(knex.raw('now()'));
            table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
        })
        .createTable('Participations', function (table) {
            table.bigincrements('id').primary();
            table.biginteger('authorId').unsigned().references('id').inTable('Users').onDelete('cascade');
            table.biginteger('answerId').unsigned().references('id').inTable('Answers').onDelete('cascade');
            table.biginteger('decisionId').unsigned().references('id').inTable('Decisions').onDelete('cascade');
            table.timestamp('createdAt').defaultTo(knex.raw('now()'));
            table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
        })
        .createTable('Comments', function (table) {
            table.bigincrements('id').primary();
            table.string('text').notNullable();
            table.boolean('isEdited').defaultsTo(false);
            table.biginteger('authorId').unsigned().references('id').inTable('Users').onDelete('cascade');
            table.biginteger('decisionId').unsigned().references('id').inTable('Decisions').onDelete('cascade');
            table.timestamp('createdAt').defaultTo(knex.raw('now()'));
            table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('Comments')
        .dropTableIfExists('Participations')
        .dropTableIfExists('Answers')
        .dropTableIfExists('DecisionTags')
        .dropTableIfExists('Tags')
        .dropTableIfExists('Decisions')
        .dropTableIfExists('Users');
};
