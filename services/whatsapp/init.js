const whatsAppBaileys = require('@whiskeysockets/baileys')
const state = globalThis.serviceState
const QRCode = require("qrcode")
const { makeWASocket, useMultiFileAuthState } = whatsAppBaileys

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
const ensureWhatsAppIsLoaded = (req, res, next) => {
    if (!state.whatsAppBot.state) {
        return res.status(500).end("silakan lakukan login whatsapp terlebih dahulu")
    }
    next()
}

async function bindWhatsApp() {
    let { state, saveCreds } = await useMultiFileAuthState("./storage/sessions/baileys");
    const sock = makeWASocket({
        auth: state,

        printQRInTerminal: true
    })
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== whatsAppBaileys.DisconnectReason.loggedOut

            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            if (shouldReconnect) {
                globalThis.serviceState.whatsAppBot.state = 2
                bindWhatsApp()
            } else {
                globalThis.serviceState.whatsAppBot.state = 0
            }
            return
        } else if (connection === 'open') {
            console.log('opened connection')
            globalThis.serviceState.whatsAppBot.state = 5
            return
        }

        if (qr) {
            globalThis.serviceState.whatsAppBot.state = 1
            QRCode.toDataURL(qr).then((url) => {
                globalThis.serviceState.whatsAppBot.qr.save(url, qr)
            });
        }
    })
    sock.ev.on('messages.upsert', m => {
        console.log(JSON.stringify(m, undefined, 2))

        console.log('replying to', m.messages[0].key.remoteJid)

        // sock.sendMessage(m.messages[0].key.remoteJid!, { text: 'Hello there!' }).then((a) => {
        // })
    })
    return sock
}

const sendMessageWTyping = async (instance, msg, jid) => {
    await instance.presenceSubscribe(jid)
    await delay(500)

    await instance.sendPresenceUpdate('composing', jid)
    await delay(2000)

    await instance.sendPresenceUpdate('paused', jid)

    await instance.sendMessage(jid, msg)
}

module.exports = {
    ensureWhatsAppIsLoaded,
    bindWhatsApp,
    sendMessageWTyping
}