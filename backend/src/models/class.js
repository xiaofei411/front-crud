const moment = require('moment');
const knex = require('../db/connection');

const getAllClasses = () =>
  knex
    .select(
      'classes.*',
      knex.raw(
        'coalesce(count(invoices.id) over (partition by classes.id), 0)::integer as seats_sold'
      )
    )
    .distinct('classes.id')
    .from('classes')
    .leftJoin('invoices', 'classes.id', 'invoices.class_id')
    .orderBy('start_timestamp', 'asc');

const getClassByID = req =>
  knex
    .select('classes.*')
    .from('classes')
    .where({
      'classes.id': req.params.id,
    })
    .first();

const getAllVendorClasses = req =>
  knex
    .select('vendors.name as vendor_name', 'classes.*')
    .from('classes')
    .leftJoin('vendors', 'vendors.id', 'classes.vendor_id')
    .where({
      'vendors.id': req.params.vendor_id,
    });

const updateVendorClass = req => {
  const updateBody = {
    updated_at: moment()
      .utc()
      .toISOString(),
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    seats: req.body.seats,
    image_url: req.body.image_url,
    start_timestamp: req.body.start_timestamp,
    end_timestamp: req.body.end_timestamp,
  };
  return knex('classes')
    .select('classes.id as class_id')
    .leftJoin('vendors', 'vendors.id', 'classes.vendor_id')
    .leftJoin('users_vendors', 'users_vendors.vendor_id', 'classes.vendor_id')
    .where({
      'vendors.id': req.params.vendor_id,
      'classes.id': req.params.class_id,
      'users_vendors.user_id': req.user.id,
      'users_vendors.permission_type': 'owner',
    })
    .first()
    .then(results =>
      knex
        .select('*')
        .from('classes')
        .where({ id: results.class_id })
        .update(updateBody)
        .returning('*')
    );
};


const getClassAndFreeSeats = req =>
  knex('classes')
    .where({ 'classes.id': req.id })
    .leftOuterJoin('invoices', 'classes.id', '=', 'invoices.class_id')
    .select('classes.*', 'invoices.amount')
    .then(result => ({
      ...result[0],
      seatsRemaining: result.reduce(
        (prev, next) => ({ amount: prev.amount - next.amount }),
        { amount: result[0].seats }
      ).amount,
    }));

    const updateClassByID = req => {

      const updateBody = {
        updated_at: moment()
          .utc()
          .toISOString(),
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        price: req.body.price,
        seats: req.body.seats,
        image_url: req.body.image_url,
        start_timestamp: req.body.start_timestamp,
        end_timestamp: req.body.end_timestamp,
      };
      console.log(updateBody);
      console.log('update');
      return knex('classes')
        .where({
          'classes.id': req.params.id,
        })
        .update(updateBody)
        .then(function (count) {
          console.log(count);
          console.log('update called');
        });
    
    };

var insert1 = {col1: "a4", col2: "b4", col3: "c4"};


const createClass = req => {
  
  const createBody = {
    created_at: moment()
      .utc()
      .toISOString(),
    name: req.body.name,
    vendor_id : req.body.vendor_id,
    description: req.body.description,
    location: req.body.location,
    price: req.body.price,
    seats: req.body.seats,
    image_url: req.body.image_url,
    start_timestamp: req.body.start_timestamp,
    end_timestamp: req.body.end_timestamp,
  };
  console.log(createBody);
  

  return knex.insert(createBody).into("classes").returning('id').then(function (id) {
    console.log(id);
    return id;
  });
  

};

const deleteClassByID = req => {
  

  return knex("classes")
      .where("id",req.params.id)
      .del().
      then(function (count) {
        console.log(count);
        return count;
      });

};

module.exports = {
  getAllClasses,
  getClassByID,
  getAllVendorClasses,
  updateVendorClass,
  getClassAndFreeSeats,
  updateClassByID,
  createClass,
  deleteClassByID,
};
