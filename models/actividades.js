"use strict";
const mongoose = require('mongoose');

var actividadesSchema = new mongoose.Schema({
    id:{ type: mongoose.Schema.Types.ObjectId},
    nombreact: { type: String, required: false, trim: true },
    descripcion: { type: String, required: false, trim: true },
    provincia: { type: String, required: false, trim: true },
    contacto: { type: String, required: false, trim: true },
    correo: { type: String, required: false, trim: true },
    habdescripcion:{ type: String, required: false, trim: true},
    precio: { type: mongoose.Schema.Types.Decimal128, required: false, trim: true},
    secprecio: {type: String, required: false, trim: true},
    infoadicional: { type: String, required: false, trim: true }, 
    estado: { type: String, required: false, trim: true, default: 'Activo'},
    fecha_pub: { type: Date, required: false, trim: true },
    compania: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: false}, 
    imagenes : { type : Array , required:false, default : [] }
},{collection:'actividades'});


let Actividades = mongoose.model('Actividades', actividadesSchema);

actividadesSchema.statics.findAll = function(callback){
    Actividades.find({},function(err,actividades) {
        if(err)
            return callback(err);
        else if(!users)
            return callback();
        return callback(null,actividades);
    })
}

/* actividadesSchema.statics.findAll = function(callback){
    Actividades.findOne({provincia:provincia},'provincia',function(err,actividades) {
        if(err)
            return callback(err);
        else if(!Actividades)
            return callback(null,'No existe ninguna actividad para esta provincia');
        Actividades.find({provincia:provincia}, function(err){
            if(err)
                return callback(err);
            return callback();//Success
        });
})   
} */

actividadesSchema.statics.delete = function(id,callback){
    Actividades.findOne({_id:id},'id',function(err,users){
        if(err)
            return callback(err);
        else if(!Actividades)
            return callback(null,'cedula no existe');
        Actividades.deleteOne({_id:id}, function(err){
                if(err)
                    return callback(err);
                return callback();//Success
            });
    })   
}


module.exports = Actividades;
