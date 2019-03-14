exports.up = knex =>
  knex.schema.createTable('events', table => {
    table
      .uuid('id')
      .unique()
      .notNullable()
      .defaultTo(knex.raw('public.gen_random_uuid()'))
      .primary();
    table
      .uuid('venue_id')
      .references('venues.id')
      .notNullable();
    table.string('name').notNullable();
    table.string('description', 2048);
    table.string('website_url').notNullable();
    table.string('image_url');
    table.bool('deleted').defaultTo(false);
    table.timestamp('start_timestamp', false).notNullable();
    table.timestamp('end_timestamp', false).notNullable();
    table.timestamps(false, true);
  });

exports.down = knex => knex.schema.dropTable('events');
