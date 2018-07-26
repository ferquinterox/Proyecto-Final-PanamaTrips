let passport = require('passport');
let User = require('../models/users');
let Compania = require('../models/companias');
let LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  // used to deserialize user
  passport.deserializeUser(function (user, done) {
   // User.findById(id, function (err, user) {
      done(null, user);
   // });
  });

  // Registro de Compania
  passport.use('local.signup_comp', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true 
  },
  function (req, email, password, done) {
    req.checkBody('email','Correo Invalido').notEmpty().isEmail();
    req.checkBody('password','Password Invalido, debe contener mas de 6 caracteres').notEmpty().isLength({min:6});
    var errors = req.validationErrors();
    if (errors) {
        let messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null,false, req.flash('error',messages));
    }
    var id_user = new mongoose.Types.ObjectId();
    User.findOne({'email': email}, function(err, user){
        var newUser = new User();
        newUser._id = id_user;
        newUser.email = email;
        newUser.nombre = req.body.nombre;
        newUser.apellido = req.body.apellido;
        newUser.provincia = req.body.provincia;
        newUser.rol = 'compania';
        newUser.passConfirm =  newUser.encryptPassword(password);
        newUser.password = newUser.encryptPassword(password);
        newUser.imagenperfil = req.file.path;
        newUser.save(function (err) {
          if (err) { 
              return done(err);}
          return done(null, newUser);
        })
    });
    Compania.findOne({'email': email}, function(err, user){
        if(err){
            return done(err);
        }
        if(user){
            return done(null, false, {message: 'El correo de esa compañia ya esta en uso'});
        }
        var newCompania = new Compania();
        newCompania.usuario = id_user;
        newCompania.email = email;
        newCompania.nombre_comp = req.body.nombre_comp;
        newCompania.tipo_comp = req.body.tipo_comp;
        newCompania.facebook = req.body.facebook;
        newCompania.twitter = req.body.twitter;
        newCompania.instagram = req.body.instagram;
        newCompania.save(function (err) {
          if (err) { 
              return done(err);}
          return done(null, newCompania);
        });
      
    });
  }));



  // Signup
  passport.use('local.signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function (req, email, password, done) {
    req.checkBody('email','Correo Invalido').notEmpty().isEmail();
    req.checkBody('password','Password Invalido, debe contener mas de 6 caracteres').notEmpty().isLength({min:6});
    var errors = req.validationErrors();
    if (errors) {
        let messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null,false, req.flash('error',messages));
    }
    User.findOne({'email': email}, function(err, user){
        if(err){
            return done(err);
        }
        if(user){
            return done(null, false, {message: 'El correo ya esta en uso'});
        }

        var newUser = new User();
        newUser.email = email;
        newUser.nombre = req.param('nombre');
        newUser.apellido = req.param('apellido');
        newUser.provincia = req.param('provincia');
        newUser.passConfirm =  newUser.encryptPassword(password);
        newUser.password = newUser.encryptPassword(password);
        newUser.imagenperfil = req.file.path;
        newUser.save(function (err) {
          if (err) { 
              return done(err);}
          return done(null, newUser);
        });
      
    });
  }));

  // login
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local
  passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password,done){
    req.checkBody('email','Correo Invalidos').notEmpty();
    req.checkBody('password','Password Invalido').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null,false, req.flash('error',messages));
    }
    User.findOne({'email': email}, function(err, user){
        if(err){
            return done(err);
        }
        if(!user){
            return done(null, false, {message: 'Usuario no Registrado'});
        }
        if (!user.validPassword(password)){
            return done(null, false, {message: 'Password Incorrecto'});
        }
      return done(null, user);
    });   
}));