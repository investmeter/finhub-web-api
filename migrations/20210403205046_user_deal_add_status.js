exports.up = function (knex) {
  return knex.schema.table('user_deals', function (table) {
    table.enu('status', ['ACTIVE', 'DELETED']).notNull().defaultTo('ACTIVE')
  })
}

exports.down = function (knex) {
  return knex.schema.table('user_deals', function (table) {
    table.dropColumn('status')
  })
}
