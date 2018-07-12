//Modulos Requeridos
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const pug = require('pug');
const path = require('path');
const morgan = require('morgan');
var actividades = require('./routes/actividades');
var administrador = require('./routes/administrador');


//Bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//Morgan
app.use(morgan('tiny'));

//Conexion con mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/panamatrips');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión: '))
db.once('open', () => {
	console.log('Conectado a la Base de Datos.');
});

//Puerto nuevo llamado NODE_JS_PORT
const port = process.env.NODE_JS_PORT || 3000;

//Rutas para que pug sepa identificar
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", 'pug');
//Rutas para que el pug sepa que directorios del bower va a usar el node, sin esto no funciona el bootstrap
app.use(express.static(path.join(__dirname, '/bower_components')));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/uploads')));
//Rutas
app.use('/',actividades);
app.use('/admin',administrador);

//separa un puerto
app.listen(port, function(){
console.log(`Escuchando en el puerto ${port}...`);
})
