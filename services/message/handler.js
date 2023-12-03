const { prismaClient } = require("../database/database")

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
    if (data.key.remoteJid.split("@")[0] === process.env.ADMIN_PHONE_NUMBER) {
        await onMsgIsFromAdminHandler(instance, data)
    } else {
        await onMsgFromClient(instance, data)
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
    if (msgTextContent.startsWith("/cekinvoice ")) { // "/cariinvoice INV-23132"
        const invoiceNumber = msgTextContent.split(" ")[1]
        const invoiceDetail = await searchInvoiceAction(invoiceNumber)
        if (invoiceDetail) {
            const { name, orderStatus, productName, productPrice, tokenListrikCustomer, whatsappNumber } = invoiceDetail
            return await instance.sendMessageWTyping({
                text: `Invoice: ${invoiceNumber} ditemukan!:\n\n---\nStatus Invoice: *${orderStatus}*\n---\nDetail\n---\nCustomer:\n*${name}*\nNomor HP:\n${whatsappNumber}\nProduk:\n*${productName}*\nToken Listrik Pelanggan:\n*${tokenListrikCustomer}*\nBiaya:\n*Rp.${productPrice}*\n---`
            }, adminJid)
        }
        return await instance.sendMessageWTyping({
            text: `Tidak ditemukan Invoice ID: ${invoiceNumber}`
        }, adminJid)
    } else if (msgTextContent.startsWith("/confirminvoice ")) {// "/confirminvoice INV-231231 nomorTokenPerpanjangan"

        const invoiceNumber = msgTextContent.split(" ")[1]
        const tokenProduk = msgTextContent.split(" ")[2]
        const confirmed = await confirmInvoiceAction(instance, data)
        if (1 && tokenProduk.length > 9) {
            return await instance.sendMessageWTyping({
                text: `Invoice dengan ID *${invoiceNumber}* berhasil diproses, detail sedang dikirim menuju client\n\nToken Perpanjangan: ${tokenProduk}`
            }, adminJid)
        }
        await instance.sendMessageWTyping({
            text: `Input Salah!\n\nPastikan Input yang dimasukkan sudah benar\n\nketik /help untuk melihat list perintah`
        }, adminJid)
        return
    } else if (msgTextContent.startsWith("/ascustomer ")) {
        console.log("emulate as client")
        await onMsgFromClient(instance, data)
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
    let newData = data
    if (newData.message?.extendedTextMessage?.text.startsWith("/ascustomer ")) {
        console.log("\n\nfound isFrom admin, replacing...\n\n")
        const sanityText = newData.message.extendedTextMessage.text.replace("/ascustomer ", "")
        newData.message.extendedTextMessage.text = sanityText
    }

    console.log(newData)

    let msgTextContent = newData.message?.extendedTextMessage?.text

    console.log("\n\n\n\n\n\n\n", msgTextContent, "\n\n\n\n\n\n\n")
    const isPaidInvoiceConfirmationMsg = msgTextContent.startsWith("Halo Kak\n") && msgTextContent.endsWith("]")

    if (msgTextContent.startsWith("/testOrderFinished ")) { // /testOrderFinished Inv-222312
        await notifyCustomerInvoiceConfirmedAction(instance, newData)
    } else if (isPaidInvoiceConfirmationMsg) {
        const invoiceNumber = msgTextContent.match(/(?<=Invoice: \[).+?(?=\])/g)[0]
        await instance.sendMessageWTyping({ text: `halo\n\nbaik kami proses terlebih dahulu invoice dengan kode:\n\n*${invoiceNumber}*\n\nTerima Kasih` }, newData.key.remoteJid)
        // await instance.sendMessageWTyping({})
    } else {
        // await instance.sendMessageWTyping({ text: "halo\n\n\nkamu telah melakukan pembayaran berikut:\n\nRp.5000000 buat makan gorengan\nTerima Kasih!" }, newData.key.remoteJid)
        await instance.sendMessageWTyping({ text: "nomor kurang tepat" }, newData.key.remoteJid)
    }


    // notifyAdmin
    // await notifyCustomerInvoiceConfirmedAction(instance, data)
}

async function searchInvoiceAction(invoiceNumber) {
    const invoice = await prismaClient.customerOrder.findFirst({
        where: {
            invoiceNumber
        }
    })
    return invoice
}

async function confirmInvoiceAction(params) {

}

async function name(params) {

}
/**
 * 
 * @param {import("@whiskeysockets/baileys").WASocket} instance 
 * @param {import("@whiskeysockets/baileys").WAProto.IWebMessageInfo} data 
 */
async function notifyCustomerInvoiceConfirmedAction(instance, data) {
    // testMode
    const invoiceNumber = data.message.extendedTextMessage.text.split(" ")[1]
    const customerJid = data.key.remoteJid
    await instance.sendMessageWTyping({
        text: `halo\nPembayaran ${invoiceNumber} sudah kami terima:\n\nBerikut detail pesanan:\n\nNama Pembeli: Customer 1\nIdPel: ${Math.floor(Math.random() * 10000000000000)}\nToken: ${Math.floor(Math.random() * 10000000000000)}\n\nTerima Kasih`
    }, customerJid)
}


module.exports = {
    msgHandler,
}