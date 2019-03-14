const express = require('express');
const passportJWT = require('../auth/jwt');
const { getAllVendors, getVendorByID } = require('../models/vendor.js');
const {
  getAllVendorClasses,
  updateVendorClass,
} = require('../models/class.js');

const router = express.Router();

router.get('/', passportJWT.authenticate('jwt'), (req, res) => {
  getAllVendors(req)
    .then(allVendors => {
      const responseBody = {
        statusCode: 200,
        statusMessage: 'Get all vendors success',
        data: allVendors,
      };
      return res.status(responseBody.statusCode).json(responseBody);
    })
    .catch(getAllVendorsError => {
      const responseBody = {
        statusCode: 500,
        statusMessage: 'Get all vendors error',
        data: getAllVendorsError,
      };
      return res.status(responseBody.statusCode).json(responseBody);
    });
});

router.get('/:vendor_id', passportJWT.authenticate('jwt'), (req, res) => {
  getVendorByID(req)
    .then(singleVendor => {
      const responseBody = {
        statusCode: 200,
        statusMessage: 'Get vendor by id success',
        data: singleVendor,
      };
      return res.status(responseBody.statusCode).json(responseBody);
    })
    .catch(getSingleVendorError => {
      const responseBody = {
        statusCode: 500,
        statusMessage: 'Get vendor by id error',
        data: getSingleVendorError,
      };
      return res.status(responseBody.statusCode).json(responseBody);
    });
});

router.get(
  '/:vendor_id/classes',
  passportJWT.authenticate('jwt'),
  (req, res) => {
    getAllVendorClasses(req)
      .then(singleVendor => {
        const responseBody = {
          statusCode: 200,
          statusMessage: 'Get vendor by id with classes success',
          data: singleVendor,
        };
        return res.status(responseBody.statusCode).json(responseBody);
      })
      .catch(getSingleVendorError => {
        const responseBody = {
          statusCode: 500,
          statusMessage: 'Get vendor by id with classes error',
          data: getSingleVendorError,
        };
        return res.status(responseBody.statusCode).json(responseBody);
      });
  }
);

router.post(
  '/:vendor_id/classes/:class_id',
  passportJWT.authenticate('jwt'),
  (req, res) => {
    updateVendorClass(req)
      .then(updatedVendorOwnedClass => {
        const responseBody = {
          statusCode: 200,
          statusMessage: 'Edit vendor owned class success',
          data: updatedVendorOwnedClass[0],
        };
        return res.status(responseBody.statusCode).json(responseBody);
      })
      .catch(updatedVendorOwnedClassError => {
        const responseBody = {
          statusCode: 500,
          statusMessage: 'Edit vendor owned class error',
          data: updatedVendorOwnedClassError,
        };
        return res.status(responseBody.statusCode).json(responseBody);
      });
  }
);

module.exports = router;
