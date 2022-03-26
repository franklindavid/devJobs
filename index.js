const mongoose = require ('mongoose');
require('./config/db');
const express= require('express');
const {engine} = require('express-handlebars');
const path = require ('path');
const router = require('./routes');
const cookieParser= require('cookie-parser');
const session = require('express-session');
const MongoStore= require('connect-mongo');
const bodyParser = require('body-parser');
const flash = require ('connect-flash');
const createError = require ('http-errors');
const passport= require('./config/passport');
// const res = require('express/lib/response');

require('dotenv').config({path: 'variables.env'});

const app= express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.engine('handlebars',
    engine({
        defaultLayout: 'layout',
        helpers: require('./helpers/handlebars')
    })
);

app.set('view engine','handlebars');

app.use(express.static(path.join(__dirname,'public')));

app.use(cookieParser());

app.use(session({
    secret: process.env.SECRETO,
    key: process.env.key,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongoUrl: process.env.DATABASE,
        mongooseConnection : mongoose.connection
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req,res,next)=>{
    res.locals.mensajes = req.flash();
    next();
});

app.use('/',router());

app.use((req,res,next)=>{
    next(createError(404,'No Encontrado'));
});

app.use((error,req,res,next)=>{
    res.locals.mensaje= error.message;
    const status = error.status || 500;
    res.locals.status = status;
    res.status(status);
    res.render('error');
})

app.listen(process.env.PUERTO);