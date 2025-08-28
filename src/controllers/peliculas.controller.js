const connectionDB = require('../config/db/conexionsequelize');

module.exports = {
  // GET /api/peliculas?search=&genero=&estado=&page=&pageSize=
  async getAllPeliculas(req, res) {
    try {
      let { search = '', genero = null, estado = 'S', page = 1, pageSize = 10 } = req.query;

      if (!estado || estado.trim() === '') {
        estado = 'S';
      }

      page = Math.max(parseInt(page) || 1, 1);
      pageSize = Math.max(parseInt(pageSize) || 10, 1);

      const offset = (page - 1) * pageSize;

      const peliculas = await connectionDB.query(
        `
        SELECT
          	Peliculas.id, 
            titulo, 
            sinopsis, 
            duracionMin, 
            Clasificacion.nombre AS Clasificación, 
            Genero.nombre AS Genero, 
            FORMAT(fechaEstreno, 'dd/MM/yyyy') AS 'fechaEstreno',
            CASE 
              WHEN Peliculas.estado = 'S' THEN 'ACTIVO'
              ELSE 'INACTIVO'
            END AS estado
        FROM Peliculas
        INNER JOIN Genero ON Genero.id = Peliculas.generoId
        INNER JOIN Clasificacion ON Clasificacion.id = Peliculas.clasificacionId
        WHERE 
          (:search = '' OR titulo LIKE '%' + :search + '%')
          AND (:genero = '' OR Genero.nombre = :genero)
          AND (:estado IS NULL OR Peliculas.estado = :estado)
        ORDER BY fechaEstreno DESC
        OFFSET :offset ROWS
        FETCH NEXT :pageSize ROWS ONLY;
        `,
        {
          replacements: { search: search, genero: genero, estado: estado, offset: offset, pageSize: pageSize },
          type: connectionDB.QueryTypes.SELECT,
        }
      );

      res.status(200).json({
        code: 200,
        message: 'OK',
        data: peliculas,
      });
    } catch (error) {
      console.error('Error en getAllPeliculas:', error);
      res.status(500).json({
        code: 500,
        message: 'Error al obtener las películas',
        data: [],
      });
    }
  },

  // GET /api/peliculas/:id
  async getPeliculaById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          code: 400,
          message: 'El ID es obligatorio',
          data: [],
        });
      }

      const [pelicula] = await connectionDB.query(
        `
        SELECT
            Peliculas.id, 
            titulo, 
            sinopsis, 
            duracionMin, 
            Clasificacion.nombre AS Clasificación, 
            Genero.nombre AS Genero, 
            FORMAT(fechaEstreno, 'dd/MM/yyyy') AS 'fechaEstreno',
            CASE 
              WHEN Peliculas.estado = 'S' THEN 'ACTIVO'
              ELSE 'INACTIVO'
            END AS estado
        FROM Peliculas
        INNER JOIN Genero ON Genero.id = Peliculas.generoId
        INNER JOIN Clasificacion ON Clasificacion.id = Peliculas.clasificacionId
        WHERE Peliculas.id = :id
      `,
        { replacements: { id: parseInt(id, 10) } }
      );

      if (!pelicula.length) {
        return res.status(404).json({
          code: 404,
          message: 'Película no encontrada',
          data: [],
        });
      }

      res.status(200).json({
        code: 200,
        message: 'OK',
        data: pelicula[0],
      });
    } catch (error) {
      console.error('Error en getPeliculaById:', error);
      res.status(500).json({
        code: 500,
        message: 'Error al obtener la película',
        data: [],
      });
    }
  },

  // POST /api/peliculas
  async createPelicula(req, res) {
    try {
      const { titulo, sinopsis, duracionMin, clasificacion, genero, fechaEstreno, user } = req.body;

      if (!titulo || !sinopsis || !duracionMin || !clasificacion || !genero || !fechaEstreno) {
        return res.status(400).json({
          code: 400,
          message: 'Faltan datos obligatorios: titulo, sinopsis, duracionMin, clasificacion, genero o fechaEstreno',
        });
      }

      const [result] = await connectionDB.query(
        `
        EXEC pa_InsPelicula 
          :titulo,
          :sinopsis,
          :duracionMin,
          :clasificacion,
          :genero,
          :fechaEstreno,
          :userCreate
        `,
        {
          replacements: {
            titulo: titulo,
            sinopsis: sinopsis,
            duracionMin: duracionMin,
            clasificacion: clasificacion,
            genero: genero,
            fechaEstreno: fechaEstreno,
            userCreate: user,
          },
        }
      );

      res.status(201).json({
        code: 201,
        message: 'Película creada',
        id: result[0].id,
      });
    } catch (error) {
      console.error('Error en createPelicula:', error);
      res.status(500).json({
        code: 500,
        message: 'Error al crear la película',
        data: [],
      });
    }
  },

  // PUT /api/peliculas/:id
  async updatePelicula(req, res) {
    try {
      const { id } = req.params;
      const { titulo, sinopsis, duracionMin, clasificacion, genero, fechaEstreno, user } = req.body;

      if (!id) {
        return res.status(400).json({
          code: 400,
          message: 'El ID del turno es obligatorio',
        });
      }

      if (!titulo || !sinopsis || !duracionMin || !clasificacion || !genero || !fechaEstreno) {
        return res.status(400).json({
          code: 400,
          message: 'Faltan datos obligatorios: titulo, sinopsis, duracionMin, clasificacion, genero o fechaEstreno',
        });
      }

      await connectionDB.query(
        `
          EXEC sp_UpdPelicula
            :id,
            :titulo,
            :sinopsis,
            :duracionMin,
            :clasificacion,
            :genero,
            :fechaEstreno,
            :userModify;
        `,
        {
          replacements: {
            id: parseInt(id, 10),
            titulo: titulo,
            sinopsis: sinopsis,
            duracionMin: duracionMin,
            clasificacion: clasificacion,
            genero: genero,
            fechaEstreno: fechaEstreno,
            userModify: user,
          },
        }
      );

      res.status(200).json({
        code: 200,
        message: 'Película actualizada',
      });
    } catch (error) {
      console.error('Error en updatePelicula:', error);
      res.status(500).json({
        code: 500,
        message: 'Error al actualizar la película',
        data: [],
      });
    }
  },

  // DELETE /api/peliculas/:id
  async deletePelicula(req, res) {
    try {
      const { id } = req.params;
      const { user } = req.body;

      if (!id) {
        return res.status(400).json({
          code: 400,
          message: 'El ID de la película es obligatorio',
        });
      }

      await connectionDB.query(
        `
        EXEC sp_DelPelicula :id, :userModify;
      `,
        {
          replacements: {
            id: parseInt(id, 10),
            userModify: user,
          },
        }
      );

      res.status(200).json({
        code: 200,
        message: 'Película eliminada',
      });
    } catch (error) {
      console.error('Error en deletePelicula:', error);
      res.status(500).json({
        code: 500,
        message: 'Error al eliminar la película',
        data: [],
      });
    }
  },

  // POST /api/peliculas/:id/turnos:bulkCreate
  async bulkCreateTurnos(req, res) {
    try {
      const { id } = req.params;
      const { turnos, userCreate } = req.body;

      if (!Array.isArray(turnos) || turnos.length === 0) {
        return res.status(400).json({
          code: 400,
          message: 'Debe enviar un array de turnos',
          data: [],
        });
      }

      for (const turno of turnos) {
        await connectionDB.query(
          `
          INSERT INTO Turnos 
            (peliculaId, sala, inicio, fin, precio, idioma, formato, aforo, estado, userCreate, fecrre)
          VALUES
            (@peliculaId, @sala, @inicio, @fin, @precio, @idioma, @formato, @aforo, 'A', @userCreate, GETDATE());
          `,
          {
            replacements: {
              peliculaId: parseInt(id, 10),
              sala: turno.sala,
              inicio: turno.inicio,
              fin: turno.fin,
              precio: turno.precio,
              idioma: turno.idioma,
              formato: turno.formato,
              aforo: turno.aforo,
              userCreate,
            },
          }
        );
      }

      res.status(201).json({
        code: 201,
        message: 'Turnos creados exitosamente',
      });
    } catch (error) {
      console.error('Error en bulkCreateTurnos:', error);
      res.status(500).json({
        code: 500,
        message: 'Error al asignar los turnos',
        data: [],
      });
    }
  },
};
