exports.up = knex =>
  knex.schema.createTable('users', table => {
    table
      .uuid('id')
      .unique()
      .notNullable()
      .defaultTo(knex.raw('public.gen_random_uuid()'))
      .primary();
    table
      .string('email')
      .notNullable()
      .unique();
    table.string('name');
    table
      .boolean('email_verified')
      .notNullable()
      .defaultTo(false);
    table.string('phone');
    table.date('birthday');
    table.string('password').notNullable();
    table.uuid('password_reset_token');
    table.timestamp('password_reset_expiration');
    table.bool('deleted').defaultTo(false);
    table.integer('role').defaultTo(0);
    table.timestamps(false, true);
  });

exports.down = knex => knex.schema.dropTable('users');
