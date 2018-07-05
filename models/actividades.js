"use strict";
const mongoose = require('mongoose');

var actividadesSchema = new mongoose.Schema({
    id:{ type: mongoose.Schema.Types.ObjectId},
    nombreact: { type: String, unique: false, required: false, trim: true },
    descripcion: { type: String, unique: false, required: false, trim: true },
    provincia: { type: Number, unique: false, required: false, trim: true },
    contacto: { type: String, unique: true, required: false, trim: true },
    habdescripcion:{ type: String, unique: true, required: false, trim: true},
    precio: { type: mongoose.Schema.Types.Decimal128, unique: true, required: false, trim: true},
    secprecio: {type: String, unique: true, required: false, trim: true},
    infoadicional: { type: String, unique: true, required: false, trim: true }, 
    estado: { type: String, unique: true, required: false, trim: true },
    fecha_pub: { type: Date, unique: true, required: false, trim: true },
    compania: { type: String, unique: true, required: false, trim: true }
},{collection:'actividades'});

actividadesSchema.statics.findAll = function(callback){
    Actividades.find({},function(err,actividades) {
        if(err)
            return callback(err);
        else if(!users)
            return callback();
        return callback(null,actividades);
    })
}

actividadesSchema.statics.insert = function(id, nombreact,decripcion,provincia,contacto,habdescripcion,precio,secprecio,infoadicional,callback){
    Actividades.findOne({id:id},'id',function(err,actividades){
        if(err){
            return callback(err)
        }
        else if(actividades){
            return callback(actividades);
        }
        else{
            var data={
                nombreact:nombreact,
                descripcion:decripcion,
                provincia:provincia,
                contacto:contacto,
                habdescripcion:habdescripcion,
                precio:precio,
                secprecio:secprecio,
                indoadicional:infoadicional,
                };
            Actividades.create(data,function(err){
                if(err)
                    return callback(err);
                return callback();
            })}
    })   
}
actividadesSchema.statics.update = function(habdescripcion,precio,secprecio,callback){
    Actividades.findOne({id:id},'habdescripcion,precio,secprecio',function(err,actividades){
        if(err)
            return callback(err);
        else if(!actividades){
            console.log(ac);
            return callback();
        }
        else{
                if(habdescripcion)
                    actividades.habdescripcion = habdescripcion;
                if(precio)
                    actividades.precio=precio;
                if(secprecio)
                    actividades.secprecio = secprecio;               
                actividades.save(function(err){
                    if(err)
                        return callback(err);
                    return callback(null,true);
                });
            }
    })   
}

actividadesSchema.statics.delete = function(id,callback){
    Estudiante.findOne({id:id},'id',function(err,users){
        if(err)
            return callback(err);
        else if(!actividades)
            return callback(null,'cedula no existe');
        Estudiante.deleteOne({id:id}, function(err){
                if(err)
                    return callback(err);
                return callback();//Success
            });
    })   
}

let Actividades = mongoose.model('Actividades',actividadesSchema);

module.exports = Actividades;
