var express = require('express');
var router = express.Router();
//EL MODEL actividad
router.get("/", (req, res) => {
    res.render("index");
});
//send es una respuesta

var actividad = require('../models/actividades');
//Pagina de actividades
router.get('/control', function(req, res){
    actividad.find()
    .select('id actividad compania fecha_pub activo')
    .exec()
    .then(doc => {
        res.render("control_admin", {
            actividad: doc
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});
//Pagina de agregar actividades
router.get('/adminActividades', function(req, res){
    res.render("adminActividades");
});


router.post('control/actualizar', function(req, res, next){
	actividad.update({
        _id: req.body.id }, $set = req.body.actividad,req.body.compania,req.body.fecha,req.body.activo, function(error,msg){
		if(error)
			next(error);
		else if(!msg){
			var err = new Error('Actividad no existe');
			err.status = 401;
            next (err);}
        alert("Actividad actualizada correctamente");
		res.redirect('/control');
		
	  });
});

//ELIMINAR
router.post('control/eliminar', function(req, res, next){
	actividad.delete(req.body.id, function(error,msg){
		if(error)
			next(error);
		else if(msg){
			var err = new Error('cedula no existe');
			err.status = 401;
			next(err);
		}
		else{
			alert('Actividad eliminada exitosamente');
			res.redirect('/control');}
	  });
});
module.exports = router;