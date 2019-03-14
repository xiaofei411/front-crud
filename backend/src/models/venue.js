const knex = require('../db/connection');

const getAllVenues = () => knex.select('venues.*').from('venues');

module.exports = { getAllVenues };
