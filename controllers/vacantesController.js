const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');
const { check, validationResult } = require('express-validator');

exports.formularioNuevaVacante = (req,res)=>{
    res.render('nueva-vacante',{
        nombrePagina: 'Nueva Vacante',
        tagline: 'Llena el formulario y publica tu vacante',
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
    })
}

exports.agregarVacante = async (req,res)=>{  
    const vacante = new Vacante (req.body);

    vacante.autor = req.user._id;

    console.log(req.body.skills);
    vacante.skills = req.body.skills.split(',');

    const nuevaVacante = await vacante.save();

    res.redirect(`/vacantes/${nuevaVacante.url}`);
} 

exports.mostrarVacante = async (req,res,next)=>{  
    const vacante= await Vacante.findOne({url: req.params.url}).populate('autor').lean();

    if (!vacante) return next();

    res.render('vacante',{
        vacante, 
        nombrePagina: vacante.titulo,
        barra:true
    })
} 

exports.formEditarVacante = async (req,res,next)=>{ 
    const vacante= await Vacante.findOne({url: req.params.url}).lean();
    if (!vacante) return next();
    res.render('editar-vacante',{
        vacante, 
        nombrePagina: `Editar - ${vacante.titulo}`,
        barra:true,
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
    })
} 
exports.editarVacante = async (req,res)=>{ 
    const vacanteActualizada = req.body;
    vacanteActualizada.skills = req.body.skills.split(',');
    const vacante = await Vacante.findOneAndUpdate(
        {url: req.params.url},
        vacanteActualizada,{
            new: true,
            runValidators: true
    });
    res.redirect(`/vacantes/${vacante.url}`);
} 

exports.validarVacante = async (req, res, next) => {
    // req.sani
    const rules = [
        check('titulo').notEmpty().withMessage('El Titulo es Obligatorio').escape(),
        check('empresa').notEmpty().withMessage('La Empresa es Obligatorio').escape(),
        check('ubicacion').notEmpty().withMessage('La Ubicacion es Obligatorio').escape(),
        check('salario').escape(),
        check('contrato').notEmpty().withMessage('El Contrato es Obligatorio').escape(),
        check('skills').notEmpty().withMessage('Es necesario marcar al menos una Skill').escape(),
    ];
    await Promise.all(rules.map( validation => validation.run(req)));
    const errores = validationResult(req);
    
    if(errores.isEmpty()){
        return next();
    }
    req.flash('error', errores.array().map(error => error.msg));
    res.render('nueva-vacante', {
        nombrePagina: 'Nueva Vacante',
        tagline: 'Llena el formulario y publica tu vacante',
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        mensajes: req.flash()
    });
    
    return;
};

exports.eliminarVacante = async (req,res)=>{ 
    const {id} = req.params;
    const vacante = await Vacante.findById(id);
    if(verificarAutor(vacante,req.user)){
        vacante.remove();
        res.status(200).send('Vacante Eliminada Correctamente');
    }else{
        res.status(403).send('Error');
    }    
} 

const verificarAutor = (vacante={},usuario={}) => {
    if (!vacante.autor.equals(usuario._id)){
        return false;
    }else{
        return true;
    }
}