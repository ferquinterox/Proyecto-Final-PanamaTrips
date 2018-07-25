var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var moment = require('moment');
var passport = require('passport');

var User = require('../models/users');
var Compania = require('../models/companias');
var actividades = require('../models/actividades');
var Reservas = require('../models/reservas');
var file = require('../public/js/files');

mongoose.Promise = global.Promise;

//ACTIVIDAD ESPECIFICA
router.get('/actividades/:actividadId', function(req, res) {
    var id = req.params.actividadId;
    var info_act = {};
    actividades.findById(id)
        .exec()
        .then(result => {
            info_act = {
                info: result
            };
            actividades.aggregate([{
                    $sample: {
                        size: 3
                    }
                }])
                .exec()
                .then(result => {
                    res.status(200).render("actividad", {
                        similares: result,
                        actividad: info_act.info
                    });
                    console.log(info_act.info);
                })
                .catch(err => {
                    res.render("error", {
                        code: err.status,
                        causa: 'Hubo un error en el servidor',
                        message: err.message
                })
                });
        })
        .catch(err => {
            res.render("error", {
                code: err.status,
                causa: 'Hubo un error en el servidor',
                message: err.message
            })
        });

});

//INSERTAR ACTIVIDADES
router.post('/insertar_act', file.any('imagen'),isLoggedIn, function(req, res, next){
        var paths = req.files.map(function(file) {
            return file.path; // or file.originalname
          });
        var actividad = new actividades({
            id: mongoose.Types.ObjectId(),
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
            compania:req.user._id,
            imagenes: paths
        });
        actividad.save().then(result => {
            console.log(result);
            res.redirect('/admin/control');    
        }).catch(err => {
            res.render("error", {
                code: err.status,
                causa: 'Hubo un error en el servidor',
                message: err.message
            })
        });     
});

//mostrar actividades por cada provincia 
router.get('/actividad/:provincia', function(req, res){
    var provincia= req.params.provincia;
    actividades.find({'provincia':provincia})
    .exec()
    .then(result => {
        res.render('actividades', {
            actividad: result
        });
    })
    .catch(err =>{
        res.render("error", {
            code: err.status,
            causa: 'Hubo un error en el servidor',
            message: err.message
        })
    })
});

//Pagina de ver provincias
router.get('/provincias', function(req, res){
    res.render("provincias");
});

//Pagina de pago (PAYPAL)
router.post('/pago', isLoggedIn,function(req, res) {
        actividades.findById(req.body.actividad)
            .exec()
            .then(result => {
                res.render("pago", {
                    usuario: req.user._id,
                    idactividad: req.body.actividad,
                    fechaI:req.body.finicio,
                    fechaS:req.body.fsalida,
                    personas:req.body.cantidad,
                    actividad: result
                });
            }).catch(err => {
                res.render("error", {
                    code: err.status,
                    causa: 'Hubo un error en el servidor',
                    message: err.message
                })
            })
});
router.post('/pago_reserva', function(req, res){
    console.log(req.body);
    var reserva = new Reservas({
        _id: mongoose.Types.ObjectId(),
        usuario: req.body.usuario,
        actividad: req.body.actividad,
        fechaI: req.body.fechaI,
        fechaS: req.body.fechaS,
        personas: req.body.personas,
        fecha_res: moment().toISOString()});
    reserva.save().then(reservas => {res.end('Pago registrado satisfactriamente')}).catch(err => {
        res.render("error", {
            code: err.status,
            causa: 'Hubo un error en el servidor',
            message: err.message
        })
    });
});

//Pagina de Sobre Nosotros
router.get('/sobreNosotros', function(req, res){
    res.render("sobreNosotros");
});

router.get('/registro', function(req, res){
	let messages = req.flash('error');
	res.render('registro',{messages: messages, hasErrors: messages.length > 0 });
});

router.post('/registrar', file.single('imagen'), passport.authenticate('local.signup', {
    successRedirect: '/',
    failureRedirect: '/registro',
    failureFlash: true
}));


//REGISTRO DE COMPANIAS
router.get('/registro-compania',  function(req, res){
    let messages = req.flash('error');
    res.render('registroHotel', {
        messages: messages,
        hasErrors: messages.length > 0
    });
});

router.post('/registrar-compania', file.single('imagen'), passport.authenticate('local.signup_comp', {
    successRedirect: '/',
    failureRedirect: '/registro-compania',
    failureFlash: true
}
)  
);

//LOGIN
router.get('/login', function(req, res) {
    let messages = req.flash('error');
    res.render('login', {
        messages: messages,
        hasErrors: messages.length > 0
    });
});

//PERFIL DEL USUARIO
router.get('/perfil', isLoggedIn, function(req, res, next) {
    var info_per = {"nombre": req.user.nombre, "apellido": req.user.apellido, "provincia": req.user.provincia, "email": req.user.email, "imagenperfil": req.user.imagenperfil};
    
    Reservas.find({
            "usuario": req.user._id
        })
        .populate('actividad', 'imagenes nombreact descripcion')
        .exec()
        .then(resultado => {
            console.log(resultado);
            Compania.find({usuario: req.user._id})
                .exec()
                .then(resultado2 => {
                res.render('profile', {
                    actividades: resultado,
                    perfil: info_per,
                    compania: resultado2
                })
            })
            }   
        ).catch(err => {
            res.render("error", {
                code: err.status,
                causa: 'Hubo un error en el servidor',
                message: err.message
            })
        });
});

router.post('/actualizar_perfil', isLoggedIn, function(req, res){
    User.findOneAndUpdate({
        _id:req.user._id},{ $set: { nombre: req.body.nombre, apellido: req.body.apellido, provincia: req.body.provincia, email: req.body.email}}).exec().then(result => {
        if (req.user.rol == 'compania'){
            Compania.findOneAndUpdate({
                usuario:req.user._id},{ $set: { facebook: req.body.facebook, twitter: req.body.twitter, instagram: req.body.instagram}}).exec().then(result => {
                res.redirect('/perfil');
                }).catch(err => {
                    res.render("error", {
                        code: err.status,
                        causa: 'Hubo un error en el servidor',
                        message: err.message
                    })
                });
        }else{
            res.redirect('/perfil');
        }
        }).catch(err => {
            res.render("error", {
                code: err.status,
                causa: 'Hubo un error en el servidor',
                message: err.message
            })
        });
});
//CERRAR SESION
router.get('/logout', function(req,res,next){
	req.logout();
	res.redirect('/')
});

router.post('/login', passport.authenticate('local.signin',{
    successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}));

//para saber si es compañia o no
function isAdmin (req, res, next){
	if(req.User.rol ==='compañia'){
		return next();
	}
	res.redirect('/index')
}


//Para saber si esta logiado o no
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
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
