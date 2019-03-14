exports.up = knex =>
  knex.schema.createTable('vendors_events', table => {
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
    table
      .uuid('event_id')
      .references('events.id')
      .notNullable();

    table.timestamps(false, true);
  });

exports.down = knex => knex.schema.dropTable('vendors_events');
