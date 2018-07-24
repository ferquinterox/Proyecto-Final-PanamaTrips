"use strict";
const mongoose = require('mongoose');

var reservasSchema = new mongoose.Schema({
    id:{ type: mongoose.Schema.Types.ObjectId},
    usuario:  { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},
    actividad:  { type: mongoose.Schema.Types.ObjectId, ref: 'Actividades', required: true},
    fechaI:{type: String, required: false, trim: true},
    fechaS:{type: String, required: false, trim: true},
    personas:{type:Number, required: false, trim: true},
    fecha_res: { type: Date, required: false, trim: true }
},{collection:'reservas'});


let Reservas = mongoose.model('Reservas', reservasSchema);

module.exports = Reservas;