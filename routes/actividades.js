var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var moment = require('moment');
var bcrypt = require('bcrypt');
var User = require('../models/users');
var actividades = require('../models/actividades');

var file = require('../public/js/files')    

mongoose.Promise = global.Promise; 
//Inicio
router.get("/", (req, res) => {
    actividades.find().select('nombreact imagenAct').limit(3)
    .exec()
    .then(doc => {
        console.log(doc)
        res.render("index", {
            actividad: doc
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
    
});

//Pagina de actividades
router.get('/actividades/:actividadId', function(req, res){
    var id = req.params.actividadId;
    actividades.findById(id)
    .exec()
    .then(result => {
        res.status(200).render("actividad", {
            actividad: result
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
});

//Pagina para insertar actividades
router.post('/insertar_act', file.single('imagen'), function(req, res, next){
        var actividad = new actividades({
            _id: mongoose.Types.ObjectId(),
            nombreact: req.body.nombreact,
            descripcion: req.body.descrip,
            provincia: req.body.provincias,
            contacto: req.body.contacto,
            correo: req.body.correo,
            habdescripcion: req.body.hab,
            precio: req.body.precio,
            secprecio: req.body.sec,
            indoadicional: req.body.infomas,
            fecha_pub: moment().toISOString(),
            imagenAct: req.file.path
        });
        actividad.save().then(result => {
            console.log(result);
            res.redirect('/admin/control');    
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        });     
});

//Pagina para logearse
router.get('/login', function(req, res, next){
    res.render("login");

});

//Pagina de pago (PAYPAL)
router.get('/pago', function(req, res){
    res.render("pago");
});

//Pagina de ofertas
router.get('/ofertas', function(req, res){
    res.render("ofertas");
});

//Pagina de registro
router.get('/registro', function(req, res){
    res.render("registro");
});

//Pagina para registrar un nuevo usuario
router.post('/registrar', function(req, res, next){
    if(req.body.password === req.body.passwordagain){
    User.find({ email: req.body.email}).exec()
        .then(user => {
            if(user.length >= 1){
                return res.status(400).json({
                    message: "Ese correo ya existe"
                });
            }else{
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err){
                        return res.status(500).json({
                            error: err + 'AQKI'
                        })
                    }else{
                        var user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            nombre: req.body.nombre,
                            apellido: req.body.apellido,
                            provincia: req.body.provincia,
                            password: hash,
                            passConfirm: hash
                        }).save().then(result => {
                            res.redirect('/login');

                        }).catch(err =>{ 
                            console.log(err);
                            res.redirect('/registrar');
                        })    
                    }
                })
            }
        })
        .catch(err =>{ 
            console.log(err);
            res.redirect('/registrar');
        })
    }else{
        console.log('NO son iguales');
        res.status(500).json({error: "Las contrasenas no coinciden"});
    }
});

//Para autenticar un usuario (FALTA)
router.post('/autenticar', function(req, res, next){
	User.authenticate(req.body.email, req.body.password, function(error,User){
		if(error){
			next(error.message);
        }
        else if(!User) {
			var err = new Error('Usuario o contraseña incorrecta');
            err.status = 401;
            res.render('login', {error: err});
        }
		else{
            req.email=User.email;
            res.redirect('/admin/control'); 
        
        }
	});
});

module.exports = router;
