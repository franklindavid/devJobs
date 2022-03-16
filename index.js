const express= require('express');
const {engine} = require('express-handlebars');
const router = require('./routes');
const path = require ('path');

const app= express();

app.engine('handlebars',
    engine({
        defaultLayout: 'layout'
    })
);

app.set('view engine','handlebars');

app.use(express.static(path.join(__dirname,'public')));

app.use('/',router());

app.listen(5000);