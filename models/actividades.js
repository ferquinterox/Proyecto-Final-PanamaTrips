"use strict";
const mongoose = require('mongoose');

var actividadesSchema = new mongoose.Schema({
    id:{ type: mongoose.Schema.Types.ObjectId},
    nombreact: { type: String, unique: false, required: false, trim: true },
    descripcion: { type: String, unique: false, required: false, trim: true },
    provincia: { type: Number, unique: false, required: false, trim: true },
    contacto: { type: String, unique: false, required: false, trim: true },
    habdescripcion:{ type: String, unique: false, required: false, trim: true},
    precio: { type: mongoose.Schema.Types.Decimal128, unique: false, required: false, trim: true},
    secprecio: {type: String, unique: false, required: false, trim: true},
    infoadicional: { type: String, unique: false, required: false, trim: true }, 
    estado: { type: String, unique: false, required: false, trim: true },
    fecha_pub: { type: Date, unique: false, required: false, trim: true },
    compania: { type: String, unique: false, required: false, trim: true }
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
            //return callback(err)
        }/* 
        else if(actividades){
            return callback(actividades);
        } */
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
                /* if(err)
                    return callback(err);
                return callback(); */
            })}
    })   
}
actividadesSchema.statics.update = function(id, nombreact,compania,activo,callback){
    Actividades.findOne({_id:id},'nombreact,compania,activo',function(err,actividades){
        if(err){
            console.log(err);
        }
            //return callback(err);
        else if(!actividades){
            console.log('NO HAY');
            //return callback();
        }
        else{
                if(nombreact)
                    actividades.nombreact = nombreact;
                if(compania)
                    actividades.compania=compania;
                if(activo)
                    actividades.activo = activo;               
                actividades.save(function(err){
                    if(err){}
                        //return callback(err);
                    //return callback(null,true);
                });
            }
    })   
}

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

let Actividades = mongoose.model('Actividades', actividadesSchema);

module.exports = Actividades;
