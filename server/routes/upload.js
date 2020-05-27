const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    // Validar tipo
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son  ' + tiposValidos.join(', ')
            }
        });
    }


    let archivo = req.files.archivo;
    let nomArvhivo = archivo.name.split('.');
    let extension = nomArvhivo[nomArvhivo.length - 1];

    // Extensiones permitidas
    let extValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extValidas.indexOf(extension) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extValidas.join(', ')
            }
        });
    }

    //Cambiar el nombre al archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    archivo.mv(`uploads/${tipo}/${ nombreArchivo }`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
    });

    if (tipo === 'usuarios') {

        imagenUsuario(id, res, nombreArchivo);
    } else {

        imagenProducto(id, res, nombreArchivo);

    }


});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {

            eliminaArchivo(nombreArchivo, 'usuarios')

            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if (!usuarioDB) {

            eliminaArchivo(nombreArchivo, 'usuarios')

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        eliminaArchivo(usuarioDB.img, 'usuarios')


        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, userSaved) => {
            res.json({
                ok: true,
                usuario: userSaved,
                img: nombreArchivo
            });
        });

    });

}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {

            eliminaArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if (!productoDB) {

            eliminaArchivo(nombreArchivo, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        eliminaArchivo(nombreArchivo, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, prodSaved) => {
            res.json({
                ok: true,
                producto: prodSaved,
                img: nombreArchivo
            });
        });

    });

}

function eliminaArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;