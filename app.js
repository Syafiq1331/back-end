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
        qr: new QR(),
        instance: whatsApp.bindWhatsApp
    }
}
var whatsAppRouteService = require('./routes/whatsapp')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var notesRouter = require('./routes/notes');
var tokensRouter = require('./routes/tokens');
var customerRouter = require('./routes/customers');
var whatsAppRouter = whatsAppRouteService.router

var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/users', whatsAppRouteService.middleware.ensureWhatsAppIsLoaded, usersRouter);
app.use('/notes', whatsAppRouteService.middleware.ensureWhatsAppIsLoaded, notesRouter);
app.use('/token', whatsAppRouteService.middleware.ensureWhatsAppIsLoaded, tokensRouter);
app.use('/customer', whatsAppRouteService.middleware.ensureWhatsAppIsLoaded, customerRouter);
app.use('/manage/whatsapp', whatsAppRouter)

globalThis.serviceState.whatsAppBot.instance()

module.exports = { app, serviceState };
