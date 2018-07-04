var express = require('express');
var app = express();
const path = require('path');
//Puerto nuevo llamado NODE_JS_PORT
const port = process.env.NODE_JS_PORT || 4000;
//Requerimientos del pug
const pug = require('pug');

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", 'pug');
//Rutas para que el pug sepa que directorios del bower va a usar el node, sin esto no funciona el bootstrap

app.use(express.static(path.join(__dirname, '/bower_components')));
app.use(express.static(path.join(__dirname, '/public')));

//crear una ruta para el node
//Metodo para renderizar el pug js
app.get("/", (req, res) => {
    res.render("index");
});
//send es una respuesta

//Pagina de ofertas
app.get('/ofertas', function(req, res){
    res.render("ofertas");
});

//Pagina de registro
app.get('/registro', function(req, res){
    res.render("registro");
});

//Pagina de registro
app.get('/login', function(req, res){
    res.render("login");
});

//separa un puerto
app.listen(port, function(){
console.log(`Escuchando en el puerto ${port}...`);
})
