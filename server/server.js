require('./config/config.js');

const express = require('express');
const mongoose = require('mongoose');

const path = require('path');

const app = express();

const bodyParse = require('body-parser');

// parse application/<-www-form-urlencoded
app.use(bodyParse.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParse.json());

// // Habilitar la carpeta public
// app.use(express.static(path.resolve(__dirname, '../public')));

//Configuración global de rutas
app.use(require('./routes/index'));

//conexión a Mongoose
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {

    if (err) throw err;
    console.log('Base de datos OnLine...');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto', process.env.PORT);
});