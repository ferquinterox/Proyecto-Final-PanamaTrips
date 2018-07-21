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
},{collection:'users'});


userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10),null);
    
};
//validar contraseñ
userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
    
};


/*userSchema.statics.authenticate = function(email,password,callback){
    User.findOne({email:email},'email password',function(err,user){
        if(err)
            return callback(err);
        else if(!user)
            return callback();
        var hash = user.password;
        if(bcrypt.compareSync(password, hash))
            return callback(null,user)
        else
            return callback();
    })
    
   
}*/

let User = mongoose.model('User',userSchema);


module.exports = User;