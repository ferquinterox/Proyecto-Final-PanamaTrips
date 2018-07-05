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
    .select('id nombreact compania fecha_pub estado')
    .exec()
    .then(doc => {
        console.log(doc)
        res.render("control_admin", {
            actividad: doc
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    }); /*
    actividad.findAll(function(error, actividades){
        if(error)
            next(error)
        else if(!actividades)
            actividades[];
        else
            res.render("control_admin") ;   
    });*/
});
//Pagina de agregar actividades
router.get('/adminActividades', function(req, res){
    res.render("adminActividades");
});


router.post('/actualizar', function(req, res, next){
	actividad.update(req.body.actividad,req.body.compania,req.body.fecha,req.body.activo, function(error,msg){
		if(error)
			next(error);
		else if(!msg){
			var err = new Error('Actividad no existe');
			err.status = 401;
            next (err);}
        alert("Actividad actualizada correctamente");
		
	  });
});

//ELIMINAR
router.post('/eliminar', function(req, res, next){
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
			}
	  });
});
module.exports = router;