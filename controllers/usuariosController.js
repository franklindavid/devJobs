const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const shortid = require('shortid');

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
    // req.sani
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

exports.formEditarPerfil =  (req,res) =>{
    res.render('editar-perfil',{
        nombrePagina : 'Edita tu perfil en devJobs',
        usuario: req.user.toObject(),
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
    })
}

exports.editarPerfil = async  (req,res) =>{
    const usuario = await Usuarios.findById(req.user._id);
    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;
    if(req.body.password){
        usuario.password =  req.body.password
    }

    if(req.file){
        usuario.imagen = req.file.filename;
    }
    
    await usuario.save();

    req.flash('correcto','Cambios Guardados Correctamente');

    res.redirect('/administracion');
}

exports.validarPerfil = async (req, res, next) => {
    const rules = [
        check('nombre').notEmpty().withMessage('El nombre es Obligatorio').escape(),
        check('email').isEmail().withMessage('El Email No es Valido').escape(),
    ];
    if(req.body.password){
        rules.push(check('password').escape());
    };
    await Promise.all(rules.map( validation => validation.run(req)));
    const errores = validationResult(req);
    
    if(errores.isEmpty()){
        return next();
    }
    req.flash('error', errores.array().map(error => error.msg));

    res.render('editar-perfil',{
        nombrePagina : 'Edita tu perfil en devJobs',
        usuario: req.user.toObject(),
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        mensajes: req.flash()
    })
    
    return;
};

exports.subirImagen = async  (req,res,next) =>{
    upload(req,res,function(error){
        if(error){
            if(error instanceof multer.MulterError){
                if(error.code=== 'LIMIT_FILE_SIZE'){
                    req.flash('error','El archivo es muy grande: Maximo 100kb');
                }else{
                    req.flash('error',error.message);
                }
                return next();
            }else{
                req.flash('error',error.message);
            }
            res.redirect('/administracion');
            return;
        }else{
            return next();
        }
    });
    next();
}

const configuracionMulter = {
    limits :{fileSize: 100000},
    storage: fileStorage = multer.diskStorage({
        destination: (req,file,cb) => {
            cb(null,__dirname+'../../public/uploads/perfiles');
        },
        filename: (req,file,cb) => {
            const extension = file.mimetype.split('/')[1];

            cb(null,`${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req,file,cb){
        if (file.mimetype === 'image/jpeg' || file.mimetype==='image/png'){
            cb(null,true);
        }else{
            cb(new Error('Formato No Valido'),false);
        }
    },
    limits :{fileSize: 100000},
}

const upload= multer(configuracionMulter).single('imagen');