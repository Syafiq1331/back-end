const express = require('express');

const middleware = {
    ensureWhatsAppIsLoaded: (req, res, next) => {
        if (!globalThis.serviceState.whatsAppBot.state) {
            return res.status(500).end("silakan lakukan login whatsapp terlebih dahulu")
        }
        next()
    },
    isWhatsAppLoggedIn: (_req, res, next) => {
        if (globalThis.serviceState.whatsAppBot.state === 5) {
            return res.end("whatsapp sudah login")
        }
        next()
    }
}

const router = express.Router();
router.get('/login-instance', middleware.isWhatsAppLoggedIn, (_req, res) => {
    if (globalThis.serviceState.whatsAppBot.qr.get()) {
        return res.status(200).writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': qr.length
        }).end(qr)
    }
    return res.status(500).end('unparseable qr code')
})

module.exports = {
    middleware, router
}