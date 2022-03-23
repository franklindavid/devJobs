const emailConfig = require('../config/email');
const nodemailer=require('nodemailer');
const hbs = require ('nodemailer-express-handlebars');
const util= require('util');
const path = require('path');


let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass
    }
  });

transport.use('compile',hbs({
    viewEngine: {
       extname: 'handlebars',
       defaultLayout: false,
    },
    viewPath: __dirname+'/../views/partials/emails',
    extName: '.handlebars',
}));

exports.enviar = async  (opciones) =>{
    const opcionesEmail = {
        from: 'devJobs <no-reply@devJobs.com>', // sender address
        to: opciones.usuario.email, // list of receivers
        subject: opciones.subject,
        template: opciones.archivo,
        context:{
            resetUrl: opciones.resetUrl
        }
    };
    const sendMail = util.promisify(transport.sendMail, transport);
    return sendMail.call(transport, opcionesEmail);
}