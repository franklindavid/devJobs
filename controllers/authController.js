const passport = require('passport');
const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');
const Usuarios = mongoose.model('Usuarios');
const crypto = require('crypto');

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

exports.formReestablecerPassword = (req,res)=>{
    res.render('reestablecer-password',{
        nombrePagina: 'Reestablece tu Password',
        tagline: 'Si ya tienes una cuenta pero olvidaste tu password, coloca tu email'
    });

}

exports.enviarToken = async (req,res)=>{
    const usuario = await Usuarios.findOne({email: req.body.email});
    if(!usuario){
        req.flash('error','No existe esa cuenta');
        return res.redirect ('/iniciar-sesion');
    }

    usuario.token= crypto.randomBytes(20),toString('hex');
    usuario.expira= Date.now() + 3600000;

    await usuario.save();
    const resetUrl= `https://${req.headers.host}/reestablecer-password/${usuario.token}`;

    req.flash('correcto','Revisa tu email para las indicaciones');
    res.redirect('/iniciar-sesion');
}