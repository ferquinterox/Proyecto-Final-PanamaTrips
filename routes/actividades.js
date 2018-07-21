var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var moment = require('moment');
var passport = require('passport');
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

//mostrar actividades por cada provincia 
router.post('/mostrar_act', function(req, res){
    //provincia: req.body.provincia
    actividades.find().where(provincia).equals(req.body.provincia)
   .select('_id nombreact compania descripcion provincia contacto correo  habdescripcion precio')
   .exec()
   .then(doc => {
       console.log(doc)
       res.redirect("/actividades", {
           actividades: doc
       });
   }).catch(err => {
       console.log(err);
       res.status(500).json({error: err});
   }); 
});

//Pagina de ver provincias
router.get('/provincias', function(req, res){
    res.render("provincias");
});

//Pagina de ver actividades por provincias
router.get('/actividades', function(req, res){
    res.render("actividades");
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
/*router.get('/registro', function(req, res){
    res.render("registro");
});
*/
//REGISTRO

router.get('/registro', function(req, res){
	let messages = req.flash('error');
	res.render('registro',{messages: messages, hasErrors: messages.length > 0 });
});

router.post('/registrar', passport.authenticate('local.signup',{
	successRedirect: '/login',
	failureRedirect: '/registro',
	failureFlash: true
}));


//LOGIN
router.get('/login', function(req, res){
	let messages = req.flash('error');
	res.render('login',{messages: messages, hasErrors: messages.length > 0 });
});

router.get('/perfil:personaID', function(req, res, next){
    var id = req.params.personaID;
    User.findById(id)
    .exec()
    .then(result => {
        res.render('profile', {
            perfil: result
        });
    })
    .catch(err =>{
        res.render(500).json({error: err.message});
    })
});
router.get('/logout', function(req,res,next){
	req.logout();
	res.redirect('/')
});

router.post('/login', passport.authenticate('local.signin',{
	successRedirect: '/admin/control',
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
