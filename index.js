var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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


var actividades = require('./routes/actividades');
app.use('/',actividades);

var administrador = require('./routes/administrador');
app.use('/admin',administrador);

//Metodo para agarrar errores
app.use((req, res, next)=>{
    const error = new Error('No se ha encontrado lo que buscabas');
    error.status = 404;
    next(error);
});
 app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            mensaje: error.message
        }
    });
    
}); 

//separa un puerto
app.listen(port, function(){
console.log(`Escuchando en el puerto ${port}...`);
})
