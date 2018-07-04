var express = require('express');
var app = express();
const path = require('path');
//Puerto nuevo llamado NODE_JS_PORT
const port = process.env.NODE_JS_PORT || 3000;
//Requerimientos del pug
const pug = require('pug');

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", 'pug');
//Rutas para que el pug sepa que directorios del bower va a usar el node, sin esto no funciona el bootstrap

app.use(express.static(path.join(__dirname, '/bower_components')));
app.use(express.static(path.join(__dirname, '/public')));

//crear una ruta para el node
//Metodo para renderizar el pug js

//Pagina de actividades
app.get('/actividades', function(req, res){
    res.render("actividades");
});
//Pagina de agregar actividades
app.get('/adminActividades', function(req, res){
    res.render("adminActividades");
});
//Pagina de pago 
app.get('/pago', function(req, res){
    res.render("pago");
});
//Pagina de ofertas
app.get('/ofertas', function(req, res){
    res.render("ofertas");
});

//Pagina de login
app.get('/login', function(req, res){
    res.render("login");
});

//Pagina de registro
app.get('/registro', function(req, res){
    res.render("registro");
});

//separa un puerto
app.listen(port, function(){
console.log(`Escuchando en el puerto ${port}...`);
})
