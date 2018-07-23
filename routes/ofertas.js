/* var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var moment = require('moment');
var passport = require('passport');

var ofertas = require('../models/ofertas');
var file = require('../public/js/files')    

mongoose.Promise = global.Promise; 

//oferta ESPECIFICA
router.get('/sonofertas/:ofertaId', function(req, res){
    var id = req.params.ofertaId;
    var info_ofert = {};
    ofertas.findById(id)
    .exec()
    .then(result => {
        info_ofert = {info: result};
        ofertas.aggregate([{ $sample: { size:1 } }])
        .exec()
        .then(result =>{
            res.status(200).render("oferta", {
                similares: result,
                oferta: info_ofert.info
            });
            console.log(info_ofert.info);
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            })
        });
    })
    .catch(err => {
        console.log(err)
    });
   
});

//INSERTAR OFERTAS  
router.post('/insertar_ofert', file.any('imagen'), function(req, res, next){
        var paths = req.files.map(function(file) {
            return file.path; // or file.originalname
          });
        var oferta = new ofertas({
            id: mongoose.Types.ObjectId(),
            nombreofer: req.body.nombreof,
            descripcion: req.body.descrip,
            provincia: req.body.provincias,
            telefono: req.body.tel,
            correo: req.body.correo,
            precio: req.body.precio,
            prexpers: req.body.prexper,
            tiempo: req.body.tiempo,
            compania:req.body.compania,
            fecha_pub: moment().toISOString(),
            imagenes: paths
        });
        oferta.save().then(result => {
            console.log(result);
            res.redirect('/admin/control');    
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        });     
});



module.exports = router; */