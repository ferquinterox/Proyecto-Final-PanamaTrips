"use strict";
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ofertasSchema = new Schema({
    id:{ type: Schema.Types.ObjectId},
    nombreact: { type: Schema.Types.ObjectId, ref: "Actividades", required: false, trim: true }, //referencia de conexion con el schema de actividades
    precio: { type: Schema.Types.Decimal128, required: false, trim: true }, //precio oferta
    tiempo:{type:Date, default: Date.now, require:false, trim:true } //tiempo de la oferta
    //tiempo:{type:Date, default: Date.setHours(48,0,0,0), require:false, trim:true } //tiempo de la oferta
});

/* 
let Ofertas = mongoose.model('Ofertas', { tiempoOf: Date });

Ofertas.findOne(function (err, doc) {
  doc.tiempoOf.setHours(48,0,0,0);
  doc.save(callback); // no lo guarda

  doc.markModified('tiempoOf');
  doc.save(callback); // works
}) */


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

module.exports = Ofertas;
