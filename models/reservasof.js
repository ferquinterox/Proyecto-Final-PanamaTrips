"use strict";
const mongoose = require('mongoose');

var reservasofSchema = new mongoose.Schema({
    id:{ type: mongoose.Schema.Types.ObjectId},
    usuario:  { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},
    oferta:  { type: mongoose.Schema.Types.ObjectId, ref: 'Ofertas', required: true},
    fechaI:{type: String, required: false, trim: true},
    personas:{type:Number, required: false, trim: true},
    fecha_res: { type: Date, required: false, trim: true }
},{collection:'reservasof'});


let Reservasof = mongoose.model('Reservasof', reservasofSchema);

module.exports = Reservasof;