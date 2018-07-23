"use strict";
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var companySchema = new mongoose.Schema({
    id:{ type: mongoose.Schema.Types.ObjectId},
    imagencompania: { type: String, unique: false, required: false, trim: true },
    nombre_comp: { type: String, unique: false, required: true, trim: true },
    tipo_comp: { type: String, unique: false, required: true, trim: true },
    email: {type: String, unique: false, required: true},
    facebook: {type: String, required: false},
    twitter: {type: String, required: false},
    instagram: {type: String, required:false},
    password: { type: String, unique: false, required: true, trim: true },
    passConfirm: { type: String, unique: false, required: true, trim: true },
    rol: {type: String, required:false, default:'compania'}
},{collection:'companias'});


companySchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10),null);
    
};
//validar contraseñ
companySchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
    
};

let Compania = mongoose.model('Compania',companySchema);


module.exports = Compania;