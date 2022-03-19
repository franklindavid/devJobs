const passport = require('passport');

exports.autenticarUsuario = passport.authenticate('local',{
    succesRedirect :'/administracion',
    failureRedirect : '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage:'Ambos campos son obligatorios'
})