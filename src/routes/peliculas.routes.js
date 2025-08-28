const express = require('express');
const router = express.Router();
const PEcontroller = require('../controllers/peliculas.controller');

//router.get('/vista', controller.renderPeliculas);

// GET /api/peliculas?search=&genero=&estado=&page=&pageSize=
router.get('/', PEcontroller.getAllPeliculas);

// POST /api/peliculas
router.post('/', PEcontroller.createPelicula);

// GET /api/peliculas/:id
router.get('/:id', PEcontroller.getPeliculaById);

// PUT /api/peliculas/:id
router.put('/:id', PEcontroller.updatePelicula);

// DELETE /api/peliculas/:id
router.delete('/:id', PEcontroller.deletePelicula);

// POST /api/peliculas/:id/turnos:bulkCreate
router.post('/:id/turnos:bulkCreate', PEcontroller.bulkCreateTurnos);

module.exports = router;
