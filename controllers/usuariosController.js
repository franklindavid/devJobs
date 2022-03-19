const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');
const { check, validationResult } = require('express-validator');
exports.formCrearCuenta = (req,res) =>{
    res.render('crear-cuenta',{
        nombrePagina: 'Crea tu cuenta en devJobs',
        tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta'
    })
} 

exports.crearUsuario = async (req,res,next) =>{

    const usuario= new Usuarios (req.body);

    try {
        await usuario.save();
        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error);
        res.redirect('/crear-cuenta');
    }    
}

exports.validarRegistro = async (req, res, next) => {
    req.sani
    const rules = [
        check('nombre').not().isEmpty().withMessage('El nombre es Obligatorio').escape(),
        check('email').isEmail().withMessage('El email debe ser valido').escape(),
        check('password').not().isEmpty().withMessage('El password no puede ir vacío').escape(),
        check('confirmar').not().isEmpty().withMessage('Confirmar password no puede ir vacío').escape(),
        check('confirmar').equals(req.body.password).withMessage('El password es diferente').escape(),
    ];
    await Promise.all(rules.map( validation => validation.run(req)));
    const errores = validationResult(req);
    
    if(errores.isEmpty()){
        return next();
    }
    req.flash('error', errores.array().map(error => error.msg));
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta en devJobs',
        tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
        mensajes: req.flash()
    });
    
    return;
};

exports.formIniciarSesion =  (req,res) =>{
    res.render('iniciar-sesion',{
        nombrePagina : 'Iniciar Sesion devJobs'
    })
}