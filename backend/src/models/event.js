const knex = require('../db/connection');

const getAllEvents = () =>
  knex
    .select(
      'events.id as id',
      'events.name as name',
      'events.venue_id as venue_id',
      'events.description as description',
      'events.website_url as website_url',
      'events.image_url as image_url',
      'events.start_timestamp as start_timestamp',
      'events.end_timestamp as end_timestamp',
      'venues.name as venue_name',
      'venues.latitude as venue_latitude',
      'venues.longitude as venue_longitude',
      'venues.website_url as venue_website_url',
      'venues.address as venue_address',
      'venues.image_url as venue_large_image_url'
    )
    .from('events')
    .leftJoin('venues', 'events.venue_id', 'venues.id');

const getEventByID = req =>
  knex
    .select('events.*')
    .from('events')
    .where({
      'events.id': req.params.id,
    })
    .first();

module.exports = { getAllEvents, getEventByID };
