exports.up = knex =>
  knex.schema.createTable('vendors', table => {
    table
      .uuid('id')
      .unique()
      .notNullable()
      .defaultTo(knex.raw('public.gen_random_uuid()'))
      .primary();
    table.string('name').notNullable();
    table.string('website_url');
    table.string('image_url');
    table.string('phone');
    table.string('email');
    table.bool('deleted').defaultTo(false);
    table.timestamps(false, true);
  });

exports.down = knex => knex.schema.dropTable('vendors');
