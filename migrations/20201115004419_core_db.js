
exports.up = function(knex) {

    return knex.schema
        .createTable('users', function (table) {
            table.uuid('user_uuid').primary()
            table.string('email', 255).notNullable();
            table.string('passHash', 255).notNullable();
        })
};

exports.down = function(knex) {

};
