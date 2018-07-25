//Modulos Requeridos
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const pug = require('pug');
const morgan = require('morgan');
var actividades = require('./routes/actividades');
var ofertas = require('./routes/ofertas');
var administrador = require('./routes/administrador');
var session = require('express-session'); 
var path = require('path');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var validator = require('express-validator');

require('./config/passport');
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

app.use('/uploads', express.static(__dirname + "/uploads"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
	secret: 'work hard',
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({mongooseConnection: db}),
	cookie: {maxAge: 60 * 60 * 1000}
  }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
//esto es para que si esta logeado le salga el boton de cerrar sesion 
  app.use(function(req,res,next){
	res.locals.login = req.isAuthenticated();
	if (req.user){
	res.locals.rol = req.user.rol;
	res.locals.id = req.user._id;
	res.locals.nombre = req.user.nombre;
	res.locals.imagen = req.user.imagenperfil;
	}
	next();
})
//Rutas
app.use('/',actividades);
app.use('/',ofertas);
app.use('/admin',administrador);
app.use(function(req, res, next) {
	res.status(404).render('error',{
		code: '404',
        causa: 'Esa pagina no existe',
        message: '404 Page doesnt exist'	
	});
  });
//separa un puerto
app.listen(port, function(){
console.log(`Escuchando en el puerto ${port}...`);
})
