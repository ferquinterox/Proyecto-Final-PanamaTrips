var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var moment = require('moment');
var passport = require('passport');

var User = require('../models/users');
var ofertas = require('../models/ofertas');
var Reservas = require('../models/reservas')
var file = require('../public/js/files')    

mongoose.Promise = global.Promise; 
//Inicio
router.get("/", (req, res) => {
    ofertas.find().select('nombreofer imagenes').limit(3)
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
router.get('ofertas/:ofertaId', function(req, res) {
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
                        unaofer: info_ofert.info
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


//mostrar oferta por el id
router.get('/ofertas/:id', function(req, res){
    var id= req.params._id;
        ofertas.find({'id':id
    }).exec()
    .then(result => {
        res.render('unaoferta', {
            unaofer: result
        });
    })
    .catch(err =>{
        res.render(500).json({error: err.message});
    })
});

//Pagina de ofertas
router.get('/unaoferta', function(req, res){
    res.render("unaoferta");
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

//Pagina de pago (PAYPAL)
router.post('/pago', function(req, res){
    var reserva = new Reservas({
        _id: mongoose.Types.ObjectId(),
        usuario: req.body.usuario,
        actividad: req.body.actividad,
        fecha_res: moment().toISOString()
    });
    reserva.save().then(result => {
        console.log(result);
        res.render("pago");
    }).catch(err => {
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

function notLoggedIn (req, res, next){
	if(!req.isAuthenticated()){
		return next();
	}
	res.redirect('/index')
}

module.exports = router;