require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const QR = require('./services/whatsapp/QR');
var whatsApp = require("./services/whatsapp/init");

globalThis.serviceState = {
    whatsAppBot: {
        state: 0, // 0 off or error, 1 state qrcode, 2 state reconnect, 5 readyState
        retriesInstance: {
            count: 0,
            max: 20
        },
        qr: new QR(),
        instance: whatsApp.bindWhatsApp() // assign and start binding
    }
}

var { router: whatsAppRouter, middleware: whatsAppMiddleware } = require('./routes/whatsapp')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var notesRouter = require('./routes/notes');
var tokensRouter = require('./routes/tokens');
var customerRouter = require('./routes/customers');

var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/users', whatsAppMiddleware.ensureWhatsAppIsLoaded, usersRouter);
app.use('/notes', whatsAppMiddleware.ensureWhatsAppIsLoaded, notesRouter);
app.use('/token', whatsAppMiddleware.ensureWhatsAppIsLoaded, tokensRouter);
app.use('/customer', whatsAppMiddleware.ensureWhatsAppIsLoaded, customerRouter);
app.use('/manage/whatsapp', whatsAppRouter)


module.exports = { app, serviceState };
