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

exports.verificarUsuario = (req,res,next) => {
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect('iniciar-sesion');
    }
}

exports.usuarioAutenticado = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/iniciar-sesion');
}
