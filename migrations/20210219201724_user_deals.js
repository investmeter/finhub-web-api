

exports.up = function(knex) {

  return knex.schema
    .createTable('user_deals', function (table) {
      table.increments('id')
      table.timestamp("timestamp",{ useTz: true } )
      table.timestamp("deal_timestamp",{ useTz: true } )
      table.enu('type',['stock','bond','etf','crypto'])
      table.uuid('user_uuid').notNullable()
      table.integer('security_id').unsigned().notNullable()
      table.decimal('amount', null).notNullable()
      table.decimal('price', null).notNullable()
      table.decimal('total_paid', null).notNullable()
      table.string('currency').notNullable()
      table.decimal('fee', null)
      table.string('fee_currency')
      table.json('payload')
      table.text('comment')
      table.index(['user_uuid'])
      table.index(['user_uuid', 'security_id'])
      table.foreign('user_uuid').references('users.user_uuid')
      table.foreign('security_id').references('securities.id')
    })
};

exports.down = function(knex) {

  return knex.schema.dropTableIfExists('user_deals')

};
