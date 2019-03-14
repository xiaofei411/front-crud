exports.up = knex =>
  knex.schema.createTable('venues', table => {
    table
      .uuid('id')
      .unique()
      .notNullable()
      .defaultTo(knex.raw('public.gen_random_uuid()'))
      .primary();
    table.string('name').notNullable();
    table.float('latitude').notNullable();
    table.float('longitude').notNullable();
    table.string('address').notNullable();
    table.string('image_url');
    table.string('website_url');
    table.string('phone');
    table.string('email');
    table.bool('deleted').defaultTo(false);
    table.timestamps(false, true);
  });

exports.down = knex => knex.schema.dropTable('venues');
