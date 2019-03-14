const knex = require('../db/connection');

const getAllVendors = () => knex.select('vendors.*').from('vendors');

const getVendorByID = req =>
  knex
    .select('vendors.*')
    .from('vendors')
    .where({
      'vendors.id': req.params.vendor_id,
    })
    .first();

module.exports = {
  getAllVendors,
  getVendorByID,
};
