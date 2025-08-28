const express = require('express');
const router = express.Router();
const controller = require('../controllers/turnos.controller');

//router.get('/vista', controller.renderTurnos);

// GET /api/turnos?peliculaId=&sala=&desde=&hasta=
router.get('/', controller.getAllTurnos);

// POST /api/turnos
router.post('/', controller.createTurno);

// GET /api/turnos/:id
router.get('/:id', controller.getTurnoById);

// PUT /api/turnos/:id
router.put('/:id', controller.updateTurno);

// DELETE /api/turnos/:id
router.delete('/:id', controller.deleteTurno);

module.exports = router;
