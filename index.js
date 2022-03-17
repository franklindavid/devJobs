const express= require('express');
const {engine} = require('express-handlebars');
const router = require('./routes');
const path = require ('path');
require('dotenv').config({path: 'variables.env'});

const app= express();

app.engine('handlebars',
    engine({
        defaultLayout: 'layout'
    })
);

app.set('view engine','handlebars');

app.use(express.static(path.join(__dirname,'public')));

app.use('/',router());

app.listen(process.env.PUERTO);