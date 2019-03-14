exports.up = knex =>
  knex.schema.createTable('classes', table => {
    table
      .uuid('id')
      .unique()
      .notNullable()
      .defaultTo(knex.raw('public.gen_random_uuid()'))
      .primary();
    table
      .uuid('vendor_id')
      .references('vendors.id')
      .notNullable();
    table.string('name').notNullable();
    table.string('description', 2048);
    table.string('location');
    table.float('price');
    table.integer('seats');
    table.string('image_url');
    table.bool('deleted').defaultTo(false);
    table.timestamp('start_timestamp', false).notNullable();
    table.timestamp('end_timestamp', false).notNullable();
    table.timestamps(false, true);
  });

exports.down = knex => knex.schema.dropTable('classes');
