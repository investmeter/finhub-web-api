
exports.up = function(knex) {

    return knex.schema
        .createTable('securities', function (table) {
            table.increments('id')
            table.enu('type',['stock','bond','etf','crypto'])
            table.string('ticker').notNullable()
            table.string('title').notNullable()
            table.string('currency').notNullable()
            table.json('provider_info')
            table.index(['ticker', 'title'], 'idx_ticker_title')
        })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('securities')
};
