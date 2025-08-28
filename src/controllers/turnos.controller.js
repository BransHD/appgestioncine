const connectionDB = require('../config/db/conexionsequelize');
const { QueryTypes } = require('sequelize');

module.exports = {
  // GET /api/turnos?peliculaId=&sala=&desde=&hasta=
  async getAllTurnos(req, res) {
    try {
      const { peliculaId = null, sala = null, desde = null, hasta = null } = req.query;

      const [turnos] = await connectionDB.query(
        `
        SELECT 
          Peliculas.titulo, 
          Turnos.sala, 
          FORMAT(Turnos.inicio, 'dd-MM-yyyy HH:mm') AS inicio, 
          FORMAT(Turnos.fin, 'dd-MM-yyyy HH:mm') AS fin, 
          Turnos.precio, 
          Turnos.idioma, 
          Turnos.formato, 
          Turnos.aforo
        FROM Turnos
        INNER JOIN Peliculas ON Turnos.peliculaId = Peliculas.id
        WHERE 
            (:peliculaId = '' OR Peliculas.titulo = :peliculaId)
            AND (:sala = '' OR Turnos.sala = :sala)
            AND (:desde = '' OR Turnos.inicio >= :desde)
            AND (:hasta = '' OR Turnos.fin <= :hasta)
            AND Turnos.estado = 'S'
        ORDER BY Turnos.inicio ASC
        `,
        {
          replacements: { peliculaId, sala, desde, hasta },
        }
      );

      res.status(200).json({
        code: 200,
        message: 'Turnos obtenidos correctamente',
        data: turnos,
      });
    } catch (error) {
      console.error('Error en getAllTurnos:', error);
      res.status(500).json({
        code: 500,
        message: 'Error al obtener los turnos',
        data: [],
      });
    }
  },

  // GET /api/turnos/:id
  async getTurnoById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          code: 400,
          message: 'El ID es obligatorio',
        });
      }

      const [turno] = await connectionDB.query(
        `
          SELECT 
            Peliculas.titulo, 
            Turnos.sala, 
            FORMAT(Turnos.inicio, 'dd-MM-yyyy HH:mm') AS inicio, 
            FORMAT(Turnos.fin, 'dd-MM-yyyy HH:mm') AS fin, 
            Turnos.precio, 
            Turnos.idioma, 
            Turnos.formato, 
            Turnos.aforo
          FROM Turnos
          INNER JOIN Peliculas ON Turnos.peliculaId = Peliculas.id
          WHERE Turnos.id = :id AND Turnos.estado = 'S'
        `,
        {
          replacements: { id: parseInt(id, 10) },
        }
      );

      if (!turno.length) {
        return res.status(404).json({
          code: 404,
          message: 'Turno no encontrado',
        });
      }

      res.status(200).json({
        code: 200,
        message: 'Turno obtenido correctamente',
        data: turno[0],
      });
    } catch (error) {
      console.error('Error en getTurnoById:', error);
      res.status(500).json({
        code: 500,
        message: 'Error al obtener el turno',
        data: [],
      });
    }
  },

  // POST /api/turnos
  async createTurno(req, res) {
    try {
      const { peliculaId, sala, inicio, fin, precio, idioma, formato, aforo, user } = req.body;

      if (!peliculaId || !sala || !inicio || !fin || !precio || !idioma || !formato || !aforo) {
        return res.status(400).json({
          code: 400,
          message: 'Faltan datos obligatorios: peliculaId, sala, inicio, fin, precio, idioma, formato o aforo',
        });
      }

      const result = await connectionDB.query(
        `
        EXEC sp_InsTurno
          :peliculaId,
          :sala,
          :inicio,
          :fin,
          :precio,
          :idioma,
          :formato,
          :aforo,
          :userCreate
        `,
        {
          replacements: {
            peliculaId: peliculaId,
            sala: sala,
            inicio: inicio,
            fin: fin,
            precio: precio,
            idioma: idioma,
            formato: formato,
            aforo: aforo,
            userCreate: user,
          },
          type: QueryTypes.SELECT,
        }
      );
      if (result[0].status === 'error') {
        return res.status(400).json({
          code: 400,
          message: 'Error al crear el turno',
          data: [{ mensaje: result[0].mensaje }],
        });
      }

      res.status(201).json({
        code: 201,
        message: 'Turno creado correctamente',
      });
    } catch (error) {
      console.error('Error en createTurno:', error);
      res.status(500).json({
        code: 500,
        message: 'Error al crear el turno',
        data: [],
      });
    }
  },

  // PUT /api/turnos/:id
  async updateTurno(req, res) {
    try {
      const { id } = req.params;
      const { sala, inicio, fin, precio, idioma, formato, aforo, user } = req.body;

      if (!id) {
        return res.status(400).json({
          code: 400,
          message: 'El ID del turno es obligatorio',
        });
      }

      if (!sala || !inicio || !fin || !precio || !idioma || !formato || !aforo) {
        return res.status(400).json({
          code: 400,
          message: 'Faltan datos obligatorios: sala, inicio, fin, precio, idioma, formato, aforo',
        });
      }

      await connectionDB.query(
        `
        EXEC sp_UpdTurno
          :id,
          :sala,
          :inicio,
          :fin,
          :precio,
          :idioma,
          :formato,
          :aforo,
          :userModify
        `,
        {
          replacements: {
            id: parseInt(id, 10),
            sala: sala,
            inicio: inicio,
            fin: fin,
            precio: precio,
            idioma: idioma,
            formato: formato,
            aforo: aforo,
            userModify: user,
          },
          type: QueryTypes.SELECT,
        }
      );

      if (result[0].status === 'error') {
        return res.status(400).json({
          code: 400,
          message: 'Error al crear el turno',
          ddata: [{ mensaje: result[0].mensaje }],
        });
      }

      res.status(200).json({
        code: 200,
        message: 'Turno actualizado correctamente',
      });
    } catch (error) {
      console.error('Error en updateTurno:', error);
      res.status(500).json({
        code: 500,
        message: 'Error al actualizar el turno',
        data: [],
      });
    }
  },

  // DELETE /api/turnos/:id
  async deleteTurno(req, res) {
    try {
      const { id } = req.params;
      const { user } = req.body;

      if (!id) {
        return res.status(400).json({
          code: 400,
          message: 'El ID del turno es obligatorio',
        });
      }

      await connectionDB.query(
        `
        EXEC sp_DelTurno :id, :userModify
        `,
        {
          replacements: { id: parseInt(id, 10), userModify: user },
        }
      );

      res.status(200).json({
        code: 200,
        message: 'Turno eliminado correctamente',
      });
    } catch (error) {
      console.error('Error en deleteTurno:', error);
      res.status(500).json({
        code: 500,
        message: 'Error al eliminar el turno',
        data: [],
      });
    }
  },
};
