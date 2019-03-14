exports.up = knex =>
  knex.schema.createTable('orders', table => {
    table
      .string('id')
      .unique()
      .notNullable()
      .primary();
    table.float('token_amount').notNullable();
    table.float('token_price').notNullable();
    table
      .uuid('user_id')
      .references('users.id')
      .notNullable();
    table.bool('paid').defaultsTo(false);
    table.string('callback_url').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

exports.down = knex => knex.schema.dropTable('orders');
