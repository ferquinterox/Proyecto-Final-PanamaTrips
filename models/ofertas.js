"use strict";
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ofertasSchema = new Schema({
    id:{ type: Schema.Types.ObjectId},
    nombreofer: { type: String, required: false, trim: true },
    compania: { type: String, required: false, trim: true },
    descripcion: { type: String, required: false, trim: true },
    provincia: { type: String, required: false, trim: true },
    telefono: { type: String, required: false, trim: true },
    precio: { type: Schema.Types.Decimal128, required: false, trim: true},
    prexpers: {type: String, required: false, trim: true},
    tiempo: { type:String, required: false, trim: true },
    estado: { type: String, required: false, trim: true, default: 'Activo'},
    fecha_pub: { type: Date, required: false, trim: true },
    correo: { type: String, required: false, trim: true },
    compania: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: false}, 
    imagenes : { type : Array , required:false, default : [] }
},{collection:'ofertas'});


let Ofertas = mongoose.model('Ofertas', ofertasSchema);

ofertasSchema.statics.findAll = function(callback){
    Ofertas.find({},function(err,ofertas) {
        if(err)
            return callback(err);
        else if(!users)
            return callback();
        return callback(null,ofertas);
    })
}

ofertasSchema.statics.delete = function(id,callback){
    Ofertas.findOne({_id:id},'id',function(err,users){
        if(err)
            return callback(err);
        else if(!Ofertas)
            return callback(null,'cedula no existe');
        Ofertas.deleteOne({_id:id}, function(err){
                if(err)
                    return callback(err);
                return callback();//Success
            });
    })   
}
module.exports = Ofertas;
