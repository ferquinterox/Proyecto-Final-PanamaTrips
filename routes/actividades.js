var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

router.get("/", (req, res) => {
    res.render("index");
});
//send es una respuesta
var user = require('../models/users');
var actividades = require('../models/actividades');
//Pagina de actividades
router.get('/actividades', function(req, res){
    res.render("actividades");
});

router.post('/insertar_act', function(req, res){
		var actividad = new actividades({
            _id: mongoose.Types.ObjectId(),
            nombreact: req.body.nombreact,
            descripcion: req.body.descrip,
            contacto: req.body.contacto,
            habdescripcion: req.body.hab,
            secprecio: req.body.sec,
            indoadicional: req.body.infomas,
        });
        actividad.save().then(result => {
            console.log(result);
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        })
	  });
router.get('/login', function(req, res, next){
    res.render("login");

});
//Pagina de pago 
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

router.post('/autenticar', function(req, res, next){
	user.authenticate(req.body.email, req.body.password, function(error,user){
		if(error){
			next(error.message);
		}
		else{
			res.redirect('/admin/control');  }
	});
});

module.exports = router;