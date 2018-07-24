var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var moment = require('moment');
var passport = require('passport');

var User = require('../models/users');
var Compania = require('../models/companias');
var actividades = require('../models/actividades');
var Reservas = require('../models/reservas')
var file = require('../public/js/files')    

mongoose.Promise = global.Promise;
//Inicio
router.get("/", (req, res) => {
    actividades.find().select('nombreact imagenes').limit(3)
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
                    res.status(500).json({
                        error: err.message
                    })
                });
        })
        .catch(err => {
            console.log(err)
        });

});

//INSERTAR ACTIVIDADES
router.post('/insertar_act', file.any('imagen'), function(req, res, next) {
    var paths = req.files.map(function(file) {
        return file.path; // or file.originalname
    });
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
        imagenes: paths
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

//INSERTAR ACTIVIDADES
router.post('/insertar_act', file.any('imagen'), function(req, res, next){
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
            imagenes: paths
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
        res.render(500).json({error: err.message});
    })
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
        compania:req.body.compa,
        fecha_pub: moment().toISOString(),
        imagenes: paths
    });
    oferta.save().then(result => {
        console.log(result);
        res.redirect('/admin/controlof');    
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    });     
});




//Pagina de ver provincias
router.get('/provincias', function(req, res){
    res.render("provincias");
});

//Pagina de ver actividades por provincias
/* router.get('/actividades', function(req, res){
    res.render("actividades");
}); */



//Pagina de pago (PAYPAL)
router.post('/pago', isLoggedIn,function(req, res) {
    var reserva = new Reservas({
        _id: mongoose.Types.ObjectId(),
        usuario: req.user._id,
        actividad: req.body.actividad,
        fechaI:req.body.finicio,
        fechaS:req.body.fsalida,
        personas:req.body.cantidad,
        fecha_res: moment().toISOString()
    });
    reserva.save().then(reservas => {
        console.log(reservas);
        actividades.findById(req.body.actividad)
            .exec()
            .then(result => {
                res.render("pago", {
                    reservas:reservas,
                    actividad: result
                });
            }).catch(err => {
                res.status(500).json({
                    error: err
                })
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
    successRedirect: '/login',
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
    successRedirect: '/login',
    failureRedirect: '/registro-compania',
    failureFlash: true
}));

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
    var id = req.params.personaID;
    var info_per = {"nombre": req.user.nombre, "apellido": req.user.apellido, "provincia": req.user.provincia, "email": req.user.email, "imagenperfil": req.user.imagenperfil};
    console.log(req.user._id);
    Reservas.find({
            "usuario": req.user._id
        })
        .populate('actividad', 'imagenes nombreact descripcion')
        .exec()
        .then(resultado => {
                res.render('profile', {
                    actividades: resultado,
                    perfil: info_per
                })
            }

        ).catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

/* router.post('/login', passport.authenticate('local.signin', {
    successRedirect: '/admin/control',
    failureRedirect: '/login',
    failureFlash: true
})); */

//CERRAR SESION
router.get('/logout', function(req,res,next){
	req.logout();
	res.redirect('/')
});

router.post('/login', passport.authenticate('local.signin',{
    successRedirect: '/admin/control',
    successRedirect: '/admin/controlof',
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
