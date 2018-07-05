var express = require('express');
var router = express.Router();

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
    actividades.insert(req.body.nombreact,req.body.descrip,req.body.provincias,req.body.contacto,req.body.habdescripcion,req.body.precio,req.body.secprecio,req.body.infomas, function(error,user){
		if(error)
			next(error);
		else if(user){
			var err = new Error('cedula ya existente');
			err.status = 401;
			next(err);}
		else
			res.redirect('/ofertas');
	  });
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
module.exports = router;
