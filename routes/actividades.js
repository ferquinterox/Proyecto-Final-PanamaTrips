var express = require('express');
var router = express.Router();

router.get("/", (req, res) => {
    res.render("index");
});
//send es una respuesta

//Pagina de actividades
router.get('/actividades', function(req, res){
    res.render("actividades");
});
//Pagina de agregar actividades
router.get('/adminActividades', function(req, res){
    res.render("adminActividades");
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

module.exports = router;
