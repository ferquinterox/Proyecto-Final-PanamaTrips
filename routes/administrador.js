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
var Compania = require('../models/companias');

var file = require('../public/js/files');
//Pagina de actividades
var ofertas = require('../models/ofertas');
var users=require('../models/users');

//Pagina para traer las actividades
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

//actualizar actividades
router.post('/admin/control/actualizaruser', function(req, res, next){
    users.findOneAndUpdate({
        _id:req.body.id},{ $set: {
            nombre:req.body.nombre,
            apellido:req.body.apellido,
            email:req.body.email,
            provincia:req.body.provincia,
            rol:req.body.rol}}).exec().then(result => {
        res.redirect('/admin/controluser');
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

//Pagina para traer todos los usuarios
router.get('/controluser',isLoggedIn, function(req, res){
     users.find()
    .select('_id nombre apellido email provincia rol')
    .exec()
    .then(doc => {
        console.log(doc)
        res.render("control_user", {
            usuario: doc
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    }); 
});

//ELIMINAR actividades
router.post('/admin/control/eliminaruser', function(req, res, next){
	users.remove({
        _id: req.body.id
    }).exec()
    .then(result => {
        res.redirect('/admin/controluser');
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

//Pagina de agregar actividades
router.get('/adminActividades',isLoggedIn, function(req, res){
    res.render("adminActividades");
});

router.get('/solicitudes', function(req, res, next){
    Compania.find()
    .select('imagencompania nombre_comp tipo_comp email facebook twitter instagram rol')
    .exec()
    .then(doc => {
        res.render('adminSolicitudes', {
            solicitudes: doc
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});


//actualizar actividades
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
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

//ELIMINAR actividades
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
router.get('/adminOfertas',isLoggedIn, isAdmin, function(req, res){
    res.render("adminOfertas");
});

//Pagina de Ofertas
router.get('/controlof',isLoggedIn, function(req, res){
     ofertas.find()
    .select('nombreofer compania descripcion provincia telefono correo tiempo precio fecha_pub estado') 
    .exec()
    .then(doc => {
        console.log(doc)
        res.render("control_adminof", {
            oferta: doc
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    }); 
});


//ACTUALIZAR OFERTAS
router.post('/admin/controlof/actualizarof',isLoggedIn, function(req, res, next){
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
            fecha_pub: req.body.fechaof,
            estado: req.body.activo}}).exec().then(result => {
        res.redirect('/admin/controlof');
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

//ELIMINAR
router.post('/admin/controlof/eliminarof', function(req, res, next){
	oferta.remove({
        _id: req.body.id
    }).exec()
    .then(result => {
        res.redirect('/admin/controlof');
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

//para saber si es compañia o no
function isAdmin (req, res, next){
	if(req.user.rol ==='compania'){
		return next();
	}
	res.redirect('/index')
}

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