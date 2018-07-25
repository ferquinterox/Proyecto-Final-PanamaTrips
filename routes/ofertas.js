var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var moment = require('moment');
var passport = require('passport');

var User = require('../models/users');
var Compania = require('../models/companias');
var ofertas = require('../models/ofertas');
var Reservasof = require('../models/reservasof')
var file = require('../public/js/files')    

mongoose.Promise = global.Promise; 
//Inicio
router.get("/", (req, res) => {
    ofertas.find().select('id nombreofer imagenes').limit(3)
        .exec()
        .then(doc => {
            console.log(doc)
            res.render("index", {
                ofertaex: doc
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })

});

//lleva todas las ofertas a pag. de ofertas.pug
router.get('/ofertas',function(req, res){
    ofertas.find()
   .select('_id nombreofer compania descripcion provincia telefono imagenes correo tiempo precio fecha_pub estado') 
   .exec()
   .then(doc => {
       console.log(doc)
       res.render("ofertas", {
           ofertai: doc
       });
   }).catch(err => {
       console.log(err);
       res.status(500).json({error: err});
   }); 
});

//oferta especifica con todo de la pag. unaoferta.pug
router.get('/ofertas/:ofertaId', function(req, res) {
    var id = req.params.ofertaId;
    var info_ofert = {};
    ofertas.findById(id)
        .exec()
        .then(result => {
            info_ofert = {
                info: result
            };
            ofertas.aggregate([{
                    $sample: {
                        size: 3
                    }
                }])
                .exec()
                .then(result => {
                    res.status(200).render("unaoferta", {
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
router.post('/insertar_ofert', file.any('imagen'), isLoggedIn, function(req, res, next){
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
        compania:req.user._id,
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

//Pagina de pago (PAYPAL)
router.post('/pagof', isLoggedIn,function(req, res) {
    ofertas.findById(req.body.oferta)
        .exec()
        .then(result => {
            res.render("pagof", {
                usuario: req.user._id,
                idoferta: req.body.oferta,
                fechaI:req.body.finicio,
                personas:req.body.cantidad,
                oferta: result
            });
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        })
});
router.post('/pagof_reserva',function(req, res) {
    console.log(req.body);
    var reserva = new Reservasof({
        _id: mongoose.Types.ObjectId(),
        usuario: req.body.usuario,
        oferta: req.body.oferta,
        fechaI: req.body.fechaI,
        personas: req.body.personas,
        fecha_res: moment().toISOString()});
    reserva.save().then(reservas => {res.end('Pago registrado satisfactriamente')}).catch(err => {
        res.status(500).json({
            error: err
        })
        console.log(err.message)
    });
});


//PERFIL DEL USUARIO
router.get('/perfil', isLoggedIn, function(req, res, next) {
    var info_per = {"nombre": req.user.nombre, "apellido": req.user.apellido, "provincia": req.user.provincia, "email": req.user.email, "imagenperfil": req.user.imagenperfil};
    console.log(req.user._id);
    Reservasof.find({
            "usuario": req.user._id
        })
        .populate('oferta', 'imagenes nombreofer descripcion')
        .exec()
        .then(resultado => {
            Compania.find({usuario: req.user._id})
                .exec()
                .then(resultado2 => {
                res.render('profile', {
                    ofertas: resultado,
                    perfil: info_per,
                    compania: resultado2
                })
            })
            }   
        ).catch(err => {
            res.status(500).json({
                error: err
            })
        });
});


//REGISTRO
//Pagina de Sobre Nosotros
router.get('/sobreNosotros', function(req, res){
    res.render("sobreNosotros");
});

//LOGIN
router.get('/login', function(req, res){
	let messages = req.flash('error');
	res.render('login',{messages: messages, hasErrors: messages.length > 0 });
});

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

//Para saber si esta logiado o no
function isLoggedIn (req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login')
}

//LOGIN
router.get('/login', function(req, res){
	let messages = req.flash('error');
	res.render('login',{messages: messages, hasErrors: messages.length > 0 });
});

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