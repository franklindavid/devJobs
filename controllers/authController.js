const passport = require('passport');
const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect :'/administracion',
    failureRedirect : '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage:'Ambos campos son obligatorios'
})

exports.mostrarPanel = async (req,res) => {
    const vacantes= await Vacante.find({ autor: req.user._id}).lean();

    res.render('administracion',{
        nombrePagina: 'Panel de administracion',
        tagline: 'Crea y Administra tus vacantes desde aqui',
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        vacantes
    });
}

exports.verificarUsuario = (req,res,next) => {
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect('/iniciar-sesion');
    }
}

exports.usuarioAutenticado = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/iniciar-sesion');
}

exports.cerrarSesion = (req,res)=>{
    req.logout();
    req.flash ('correcto', 'Cerraste Sesion Correctamente');
    return res.redirect('/iniciar-sesion');
}
