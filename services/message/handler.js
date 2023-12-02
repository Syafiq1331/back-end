/**
 * 
 * @param {*} instance 
 * @param {import("@whiskeysockets/baileys").WAProto.IWebMessageInfo} data 
 */
async function msgHandler(instance, data) {

    // Halo kak saya sudah melakukan pembayaran\nno Invoice: [no invoice yang generate otomatis tertulis disini]

    console.log("\n\n\n\n\n\n\n\n\n\n")
    console.log("---------------------------------------\nmsg received\n")
    const msgTextContent = data.message?.extendedTextMessage?.text
    // console.log("hasil", !data.key.remoteJid.split("@")[0] === process.env.ADMIN_PHONE_NUMBER)
    if (data.key.remoteJid.split("@")[0] === process.env.ADMIN_PHONE_NUMBER) {
        await onMsgIsFromAdminHandler(instance, data)
    } else {
        if (msgTextContent.startsWith("Halo Kak\n") && msgTextContent.endsWith("]")) {
            const invoiceNumber = msgTextContent.match(/(?<=Invoice: \[).+?(?=\])/g)[0]
            await instance.sendMessageWTyping({ text: `halo\n\nbaik kami proses terlebih dahulu invoice dengan kode:\n\n*${invoiceNumber}*\n\nTerima Kasih` }, data.key.remoteJid)
        } else {
            await instance.sendMessageWTyping({ text: "halo\n\n\nkamu telah melakukan pembayaran berikut:\n\nRp.5000000 buat makan gorengan\nTerima Kasih!" }, data.key.remoteJid)
        }
    }
    console.log(data)
    console.log("\n---------------------------------------")
    console.log("\n\n\n\n\n\n\n\n\n\n")
}


// queue
/**
 * 
 * @param {*} instance 
 * @param {import("@whiskeysockets/baileys").WAProto.IWebMessageInfo} data 
 */
async function onMsgIsFromAdminHandler(instance, data) {
    const msgTextContent = data.message?.extendedTextMessage?.text
    const adminJid = data.key.remoteJid
    if (msgTextContent.startsWith("/cariinvoice ")) { // "/cariinvoice INV-23132"
        const invoiceDetail = await searchInvoiceAction(instance, data)
        const invoiceNumber = msgTextContent.split(" ")[1]
        if (1) {
            await instance.sendMessageWTyping({
                text: `Invoice: ${invoiceNumber} ditemukan!:\n\n---\nCustomer: *Customer 1*\nProduk: *Token Listrik Rp.200.000*\nBiaya: *Rp.195.000*\nStatus Invoice: *pending*\n---`
            }, adminJid)
        }
        return
    } else if (msgTextContent.startsWith("/confirminvoice ")) {// "/confirminvoice INV-231231 nomorTokenPerpanjangan"

        const invoiceNumber = msgTextContent.split(" ")[1]
        const tokenProduk = msgTextContent.split(" ")[2]
        const confirmed = await confirmInvoiceAction(instance, data)
        if (1) {
            await instance.sendMessageWTyping({
                text: `Invoice dengan ID *${invoiceNumber}* berhasil diproses, detail sedang dikirim menuju client\n\nToken Perpanjangan: ${tokenProduk}`
            }, adminJid)
        }
        return
    }
    console.log(`\n\n\n\n\n\nMSG MASUK DARI ADMINN ${data.key.remoteJid.split("@")[0]}\nMSG MASUK DARI ADMINN ${data.key.remoteJid.split("@")[0]}\nMSG MASUK DARI ADMINN ${data.key.remoteJid.split("@")[0]}\nMSG MASUK DARI ADMINN ${data.key.remoteJid.split("@")[0]}\n\n\n\n\n\n`)
    // adminTakeOrderAction
}

// onMsgIsConfirmationOrder
/**
 * 
 * @param {import("@whiskeysockets/baileys").WASocket} instance 
 * @param {import("@whiskeysockets/baileys").WAProto.IWebMessageInfo} data 
 */
async function onMsgFromClient(instance, data) {
    // notifyAdmin
}

async function searchInvoiceAction(params) {
    const { instance } = globalThis.serviceState.whatsAppBot
}

async function confirmInvoiceAction(params) {

}


module.exports = {
    msgHandler
}