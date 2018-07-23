"use strict";
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
    id:{ type: mongoose.Schema.Types.ObjectId},
    email: { type: String, unique: true, required: true, trim: true },
    nombre: { type: String, unique: false, required: true, trim: true },
    apellido: { type: String, unique: false, required: true, trim: true },
    provincia: {type: String, unique: false, required: true},
    password: { type: String, unique: false, required: true, trim: true },
    passConfirm: { type: String, unique: false, required: true, trim: true },
    imagenperfil: {type: String, required: false},
    rol:{type: String, unique: false, required: true, trim: true, default:'usuario'}
},{collection:'users'});

let Users = mongoose.model('Users', userSchema);

userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10),null);
    
};
//validar contraseñ
userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
    
};

userSchema.statics.findAll = function(callback){
    Users.find({},function(err,user) {
        if(err)
            return callback(err);
        else if(!user)
            return callback();
        return callback(null,user);
    })
}

userSchema.statics.delete = function(id,callback){
    Users.findOne({_id:id},'id',function(err,user){
        if(err)
            return callback(err);
        else if(!Users)
            return callback(null,'Este usuario no existe');
        Users.deleteOne({_id:id}, function(err){
                if(err)
                    return callback(err);
                return callback();//Success
            });
    })   
}

let User = mongoose.model('User',userSchema);


module.exports = User;