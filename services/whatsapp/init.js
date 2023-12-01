const whatsAppBaileys = require('@whiskeysockets/baileys')
const QRCode = require("qrcode")
const NodeCache = require('node-cache')
const readline = require('readline')
const transferConfirmationHandler = require('./handler')
const { makeWASocket, delay, useMultiFileAuthState, Browsers, makeCacheableSignalKeyStore,makeInMemoryStore,DisconnectReason, readAndEmitEventStream, } = whatsAppBaileys
const state = globalThis.serviceState
const MAIN_LOGGER = require("./logger")

const logger = MAIN_LOGGER.child({})
logger.level = 'trace'

const useStore = !process.argv.includes('--no-store')
const doReplies = !process.argv.includes('--no-reply')
const usePairingCode = process.argv.includes('--use-pairing-code')
const useMobile = process.argv.includes('--mobile')

// external map to store retry counts of messages when decryption/encryption fails
// keep this out of the socket itself, so as to prevent a message decryption/encryption loop across socket restarts
const msgRetryCounterCache = new NodeCache()

// Read line interface
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise<string>((resolve) => rl.question(text, resolve))

// the store maintains the data of the WA connection in memory
// can be written out to a file & read from it
const store = useStore ? makeInMemoryStore({logger}) : undefined
store?.readFromFile('./dev/auth/baileys_store_multi.json')
// save every 10s
setInterval(() => {
	store?.writeToFile('./dev/auth/baileys_store_multi.json')
}, 10_000)


/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
const ensureWhatsAppIsLoaded = (req, res, next) => {
    if (!globalThis.serviceState.whatsAppBot.state) {
        return res.status(500).end("silakan lakukan login whatsapp terlebih dahulu")
    }
    next()
}

async function bindWhatsApp() {
    let { state, saveCreds } = await useMultiFileAuthState("./storage/sessions/baileys");
    const sock = makeWASocket({
        auth: {
			creds: state.creds,
			/** caching makes the store faster to send/recv messages */
			keys: makeCacheableSignalKeyStore(state.keys, (a)=>{
                console.log(a)
            }),
		},
        printQRInTerminal: true
    })

    store?.bind(sock.ev)

    sock.ev.process(
        async(events) =>{
            if(events['connection.update']) {
                const update = events['connection.update']
				const { connection, lastDisconnect, qr } = update
                
                if(update.isOnline || update.connection === 'open') globalThis.serviceState.whatsAppBot.state = 5

				if(connection === 'close') {
					// reconnect if not logged out
					if(lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
                        globalThis.serviceState.whatsAppBot.state = 2
						bindWhatsApp()
					} else {
                        globalThis.serviceState.whatsAppBot.state = 0
						console.log('Connection closed. You are logged out.')
					}
				}

				// received a new message
				if(events['messages.upsert']) {
					const upsert = events['messages.upsert']
					console.log("\n\n\n\n")
					console.log('recv messages ', JSON.stringify(upsert, undefined, 2))
					console.log("\n\n\n\n")
					if(upsert.type === 'notify') {
						for(const msg of upsert.messages) {
							if(!msg.key.fromMe && doReplies) {
								console.log('replying to', msg.key.remoteJid)
								await sock.readMessages([msg.key])
								await sendMessageWTyping({ text: 'Hello there!' }, msg.key.remoteJid)
								console.log("\n\n\n\n")
							}
						}
					}
				}

                if(qr){
                    globalThis.serviceState.whatsAppBot.state = 1
                    QRCode.toDataURL(qr).then((url) => {
                        globalThis.serviceState.whatsAppBot.qr.save(url, qr)
                    });
                }
                    
				console.log('connection update', update)
			}

            if(events['creds.update']) {
				await saveCreds()
			}
        }
    )

    const sendMessageWTyping = async(msg, jid) => {
		await sock.presenceSubscribe(jid)
		await delay(500)

		await sock.sendPresenceUpdate('composing', jid)
		await delay(2000)

		await sock.sendPresenceUpdate('paused', jid)

		await sock.sendMessage(jid, msg)
	}

    return sock
}

module.exports = {
    ensureWhatsAppIsLoaded,
    bindWhatsApp,
}