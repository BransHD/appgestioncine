const express = require('express');
const router = express.Router();
const COcontroller = require('../controllers/configuracion.controller');

router.get('/', COcontroller.getAllConfiguraciones);


module.exports = router;
