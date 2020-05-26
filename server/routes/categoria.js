const express = require('express');
// const _ = require('underscore');

let { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// GET categorías (Muestra todas las categorias)
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriasDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }

            res.json({
                ok: true,
                categorias: categoriasDB
            });
        });

});

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// GET categorías (Muestra categoría por id)
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró la categoría'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// POST categorías (Crea una categoría)
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({

        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if (!categoriaDB) {

            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// PUT categorías (Actualiza una categoría)
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    // let body = _.pick(req.body, ['descripcion']);
    let body = req.body;
    let descCategoria = body.descripcion;

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB,
            descripcion: descCategoria

        });
    });

});

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// GET categorías (Elimina una categoría)
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.delete('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }

            });
        }

        res.json({
            ok: true,
            categoriaeliminada: categoriaBorrada
        });
    });
});



module.exports = app;