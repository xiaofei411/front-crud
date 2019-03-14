exports.up = knex =>
  knex.schema.createTable('preferences', table => {
    table
      .uuid('id')
      .unique()
      .notNullable()
      .defaultTo(knex.raw('public.gen_random_uuid()'))
      .primary();
    table.bool('allow_analysis').notNullable();
    table.bool('allow_communication').notNullable();
    table
      .uuid('user_id')
      .references('users.id')
      .notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

exports.down = knex => knex.schema.dropTable('preferences');
