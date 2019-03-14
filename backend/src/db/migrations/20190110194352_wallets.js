exports.up = knex =>
  knex.schema.createTable('wallets', table => {
    table
      .uuid('id')
      .unique()
      .notNullable()
      .defaultTo(knex.raw('public.gen_random_uuid()'))
      .primary();
    table.enu('type', ['credit', 'debit']);
    table.float('amount');
    table
      .uuid('user_id')
      .references('users.id')
      .notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

exports.down = knex => knex.schema.dropTable('wallets');
