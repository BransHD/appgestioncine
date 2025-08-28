const connectionDB  = require('../config/db/conexionsequelize');

module.exports = {
  async getAllConfiguraciones(req, res) {
    try {
      const [configuraciones] = await sequelize.query(`SELECT * FROM Configuracion`);
      res.status(200).json({
        code: 200,
        message: 'OK',
        data: configuraciones,
      });
    } catch (error) {
      console.error('Error en getAllConfiguraciones:', error);
      res.status(500).json({
        code: 500,
        message: 'Error al obtener las configuraciones',
        data: [],
      });
    }
  },
};
