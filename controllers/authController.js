const passport = require('passport');

exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect :'/administracion',
    failureRedirect : '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage:'Ambos campos son obligatorios'
})

exports.mostrarPanel = (req,res) => {
    res.render('administracion',{
        nombrePagina: 'Panel de administracion',
        tagline: 'Crea y Administra tus vacantes desde aqui'
    });
}