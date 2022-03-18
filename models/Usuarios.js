const mongoose= require('mongoose');
const bcrypt = require ('bcrypt');

const usuariosSchema = new mongoose.Schema({
    email:{
        type: String,
        required: 'El nombre de la vancante es obligatorio',
        trim: true,
        unique: true,
        lowercase: true
    },
    nombre:{
        type: String,
        required: 'El nombre es obligatorio',
        trim: true
    },
    password:{
        type: String,
        required: 'El password es obligatorio',
        trim: true
    },
    token:{
        type: String
    },
    expira:{
        type: Date
    },
});

usuariosSchema.pre('save', async function(next){
    if (!this.isModified('password')){        
        return next();
    }
    const hash = await bcrypt.hash(this.password,12);
    this.password = hash;
    next();
});
module.exports = mongoose.model('Usuarios', usuariosSchema);