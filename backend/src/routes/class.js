const express = require('express');
const passportJWT = require('../auth/jwt');
const { getAllClasses, getClassByID, createClass, updateClassByID, deleteClassByID } = require('../models/class.js');

const router = express.Router();

router.get('/', (req, res) => {
  getAllClasses(req)
    .then(allClasses => {
      const responseBody = {
        statusCode: 200,
        statusMessage: 'Get all classes success',
        data: allClasses,
      };
      return res.status(responseBody.statusCode).json(responseBody);
    })
    .catch(getAllClassesError => {
      const responseBody = {
        statusCode: 500,
        statusMessage: 'Get all classes error',
        data: getAllClassesError,
      };
      return res.status(responseBody.statusCode).json(responseBody);
    });
});

router.get('/:id', passportJWT.authenticate('jwt'), (req, res) => {
  getClassByID(req)
    .then(singleClass => {
      const responseBody = {
        statusCode: 200,
        statusMessage: 'Get class by id success',
        data: singleClass,
      };
      return res.status(responseBody.statusCode).json(responseBody);
    })
    .catch(getSingleClassError => {
      const responseBody = {
        statusCode: 500,
        statusMessage: 'Get class by id error',
        data: getSingleClassError,
      };
      return res.status(responseBody.statusCode).json(responseBody);
    });
});

router.post('/:id', passportJWT.authenticate('jwt'), (req, res) => {
  updateClassByID(req)
    .then(singleClass => {
      const responseBody = {
        statusCode: 200,
        statusMessage: 'Update class by ID success',
        data: singleClass,
      };
      return res.status(responseBody.statusCode).json(responseBody);
    })
    .catch(getSingleClassError => {
        console.log(getSingleClassError);
      const responseBody = {
        statusCode: 500,
        statusMessage: 'Update class by ID  error',
        data: getSingleClassError,
      };
      return res.status(responseBody.statusCode).json(responseBody);
    });
});

router.delete('/:id', passportJWT.authenticate('jwt'), (req, res) => {

  deleteClassByID(req)
    .then(singleClass => {
      const responseBody = {
        statusCode: 200,
        statusMessage: 'Delete class by ID success',
        data: singleClass,
      };
      return res.status(responseBody.statusCode).json(responseBody);
    })
    .catch(getSingleClassError => {
      const responseBody = {
        statusCode: 500,
        statusMessage: 'Delete class by ID  error',
        data: getSingleClassError,
      };
      return res.status(responseBody.statusCode).json(responseBody);
    });
});


router.post('/', passportJWT.authenticate('jwt'), (req, res) => {

  createClass(req)
    .then(singleClass => {
      const responseBody = {
        statusCode: 200,
        statusMessage: 'Create class success',
        data: singleClass,
      };
      return res.status(responseBody.statusCode).json(responseBody);
    })
    .catch(getSingleClassError => {
      const responseBody = {
        statusCode: 500,
        statusMessage: 'Create class error',
        data: getSingleClassError,
      };
      return res.status(responseBody.statusCode).json(responseBody);
    });
});
module.exports = router;
