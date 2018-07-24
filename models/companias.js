"use strict";
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var companySchema = new mongoose.Schema({
    id:{ type: mongoose.Schema.Types.ObjectId},
    usuario: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: false},
    nombre_comp: { type: String, unique: false, required: true, trim: true },
    tipo_comp: { type: String, unique: false, required: true, trim: true },
    email: {type: String, unique: false, required: true},
    activo: {type: String, unique: false, default: 'Inactivo'},
    facebook: {type: String, required: false},
    twitter: {type: String, required: false},
    instagram: {type: String, required:false}
},{collection:'companias'});

let Compania = mongoose.model('Compania',companySchema);


module.exports = Compania;