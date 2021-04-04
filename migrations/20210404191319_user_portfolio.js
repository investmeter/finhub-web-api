
exports.up = function(knex) {
  return knex.schema
    .createTable('user_portfolio', function (table) {
      table.increments('id')
      table.timestamp("timestamp_created",{ useTz: true } )
      table.enu('status', ['ACTIVE','DELETED','FROZEN'])
      table.uuid('user_uuid').notNullable()
      table.string('title').notNullable()
      table.string('description')
      table.json('display_options').comment(`iconUri`)

      table.index(['user_uuid'])
      table.unique(['user_uuid', 'title', 'status'])
      table.foreign('user_uuid').references('users.user_uuid')

    })
}


exports.down = function(knex) {
  return knex.schema.dropTableIfExists('user_portfolio')
}
