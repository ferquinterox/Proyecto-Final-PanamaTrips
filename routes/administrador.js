var express = require('express');
var router = express.Router();

//EL MODEL actividad
router.get("/", (req, res) => {
    res.render("index");
});
//send es una respuesta

var actividad = require('../models/actividades');
console.log(actividad);


//Pagina de actividades
router.get('/control', function(req, res){
     actividad.find()
    .select('_id nombreact compania fecha_pub estado')
    .exec()
    .then(doc => {
        console.log(doc)
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


router.post('/admin/control/actualizar', function(req, res, next){
    actividad.findOneAndUpdate({
        _id:req.body.id},{ $set: {nombreact: req.body.actividad,compania: req.body.compania,fecha_pub: req.body.fecha, estado: req.body.activo}}).exec().then(result => {
        res.redirect('/admin/control');
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

//ELIMINAR
router.post('/admin/control/eliminar', function(req, res, next){
	actividad.remove({
        _id: req.body.id
    }).exec()
    .then(result => {
        res.redirect('/admin/control');
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});
module.exports = router;