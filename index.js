const mongoose = require ('mongoose');
require('./config/db');
const express= require('express');
const {engine} = require('express-handlebars');
const router = require('./routes');
const cookieParser= require('cookie-parser');
const session = require('express-session');
const MongoStore= require('connect-mongo');
// const MongoStore= require('connect-mongo')(session);
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

app.use('/',router());

app.listen(process.env.PUERTO);