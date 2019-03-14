exports.up = knex =>
  knex.schema.createTable('users_vendors', table => {
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
      .uuid('vendor_id')
      .references('vendors.id')
      .notNullable();
    table.enu('permission_type', ['owner', 'editor']).notNullable();
    table.timestamps(false, true);
  });

exports.down = knex => knex.schema.dropTable('users_vendors');
