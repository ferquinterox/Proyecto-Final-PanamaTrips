var express = require('express');
const multer = require('multer');
var router = express.Router();
var moment = require('moment');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise; 
//EL MODEL actividad
router.get("/", (req, res) => {
    res.render("index");
});
//send es una respuesta
var actividad = require('../models/actividades');
var ofertas = require('../models/ofertas');

//Pagina de actividades
router.get('/control',isLoggedIn, function(req, res){
     actividad.find()
    .select('_id nombreact compania descripcion provincia contacto correo fecha_pub estado habdescripcion precio')
    .exec()
    .then(doc => {
        console.log(doc)
        res.render("control_admin", {
            actividad: doc
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    }); 
});
//Pagina de agregar actividades
router.get('/adminActividades',isLoggedIn, function(req, res){
    res.render("adminActividades");
});

router.post('/admin/control/actualizar', function(req, res, next){
    actividad.findOneAndUpdate({
        _id:req.body.id},{ $set: {
            nombreact: req.body.actividad,
            compania: req.body.compania,
            descripcion: req.body.descrip,
            provincia: req.body.provincias,
            contacto: req.body.contacto,
            correo: req.body.correo,
            habdescripcion: req.body.hab,
            precio: req.body.precio,
            fecha_pub: req.body.fecha,
            estado: req.body.activo}}).exec().then(result => {
        res.redirect('/admin/control');
    })
    /* _id: mongoose.Types.ObjectId(),
            nombreact: req.body.nombreact,
            descripcion: req.body.descrip,
            provincia: req.body.provincias,
            contacto: req.body.contacto,
            correo: req.body.correo,
            habdescripcion: req.body.hab,
            precio: req.body.precio,
            secprecio: req.body.sec,
            indoadicional: req.body.infomas,
            fecha_pub: moment().toISOString()*/
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

//ELIMINAR
router.post('/admin/control/eliminar', function(req, res, next){
	actividad.remove({
        _id: req.body.id
    }).exec()
    .then(result => {
        res.redirect('/admin/control');
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});



//Rederizado a la pag. de adminOfertas
router.get('/adminOfertas',isLoggedIn, function(req, res){
    res.render("adminOfertas");
});

//Pagina de Ofertas
router.get('/control',isLoggedIn, function(req, res){
     ofertas.find()
    .select('nombreofer compania descripcion provincia telefono correo tiempo precio fecha_pub estado') 
    .exec()
    .then(doc => {
        console.log(doc)
        res.render("control_admin", {
            oferta: doc
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    }); 
});



router.post('/admin/control/actualizarof',isLoggedIn, function(req, res, next){
    ofertas.findOneAndUpdate({
        _id:req.body.id},{ $set: {
            nombreofer: req.body.oferta,
            compania: req.body.compania,
            descripcion: req.body.descrip,
            provincia: req.body.provincias,
            telefono: req.body.telefono,
            correo: req.body.correo,
            tiempo: req.body.tiempo,
            precio: req.body.precio,
            fecha_pub: req.body.fecha,
            estado: req.body.activo}}).exec().then(result => {
        res.redirect('/admin/control');
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});



//Para saber si esta logiado o no
function isLoggedIn (req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login')
}


function notLoggedIn (req, res, next){
	if(!req.isAuthenticated()){
		return next();
	}
	res.redirect('/index')
}
module.exports = router;