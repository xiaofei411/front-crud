exports.up = knex =>
  knex.schema.createTable('invoices', table => {
    table
      .uuid('id')
      .unique()
      .notNullable()
      .defaultTo(knex.raw('public.gen_random_uuid()'))
      .primary();
    table
      .uuid('user_id')
      .references('users.id')
      .notNullable();
    table
      .uuid('class_id')
      .references('classes.id')
      .notNullable();
    table
      .uuid('wallet_id')
      .references('wallets.id')
      .notNullable();
    table.integer('amount').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

exports.down = knex => knex.schema.dropTable('invoices');
