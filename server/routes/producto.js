const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// GET Obtener todos los productos!
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }

            res.json({
                ok: true,
                productos: productoDB
            });
        });
});

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// GET Obtener producto por ID
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontró el ID dle producto'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// GET Buscar productos
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }

            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontró producto'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productos
            });

        });

});


//::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// POST Crear Producto nuevo!
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });
});

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// PUT Actualizar un producto
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let body = req.body;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID del producto no existe'
                }
            });
        }

        productoDB.nombre = body.nombre,
            productoDB.precioUni = body.precioUni,
            productoDB.categoria = body.categoria,
            productoDB.disponible = body.disponible,
            productoDB.descripcion = body.descripcion

        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }

            res.json({
                ok: true,
                prodcuto: productoGuardado
            });
        });

    });

});

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// DELETE Eliminar un producto
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findByIdAndUpdate(id, (err, prodDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if (!prodDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID del producto no existe'
                }
            });
        }

        prodDB.disponible = false;

        prodDB.save((err, prodBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }

            res.json({
                ok: true,
                productoEliminado: prodBorrado,
                mensaje: 'Producto eliminado'
            });

        });


    });
});

module.exports = app;