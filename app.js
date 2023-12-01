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

const { ensureWhatsAppIsLoaded } = whatsApp

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
app.get('/manage/whatsapp-instance', (_req, res, next) => {
    if (globalThis.serviceState.whatsAppBot.state === 5) {
        return res.end("whatsapp sudah login")
    }
    next()
}, (_req, res) => {
    const qr = globalThis.serviceState.whatsAppBot.qr.get()
    res.status(200).writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': qr.length
    }).end(qr)
})

app.use('/users', ensureWhatsAppIsLoaded, usersRouter);
app.use('/notes', ensureWhatsAppIsLoaded, notesRouter);
app.use('/token', ensureWhatsAppIsLoaded, tokensRouter);
app.use('/customer', ensureWhatsAppIsLoaded, customerRouter);

globalThis.serviceState.whatsAppBot.instance()

module.exports = { app, serviceState };
