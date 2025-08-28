require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());

// Rutas
//app.use('/api/configuracion', require('./routes/configuracion.routes'));
app.use('/api/peliculas', require('./src/routes/peliculas.routes'));
app.use('/api/turnos', require('./src/routes/turnos.routes'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ code: 'ERROR', message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
