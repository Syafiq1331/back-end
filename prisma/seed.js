const { prismaClient } = require('../services/database/database')
const bcrypt = require('bcrypt')

async function main() {

    const hashedPassword = await bcrypt.hash('password123', 10); // Ganti dengan password yang Anda inginkan
    function generateUniqueInvoiceNumber() {
        // Logic to generate a unique invoice number
        // For example, you can combine current timestamp with a random number
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        return `INV-${timestamp}-${random}`;
    }

    await prismaClient.user.createMany({
        data: [
            {
                nama: 'User 1',
                email: 'user1@example.com',
                password: hashedPassword,
            },
            {
                nama: 'User 2',
                email: 'user2@example.com',
                password: hashedPassword,
            },
        ]
    })

    await prismaClient.product.createMany({
        data: [
            {
                name: "TOKEN LISTRIK - 100.000",
                price: 95000,
                exactCost: 100000,
                quantityStock: 999,
                createdAt: new Date(),
                modifiedAt: new Date()
            },
            {
                name: "TOKEN LISTRIK - 200.000",
                price: 195000,
                exactCost: 200000,
                quantityStock: 999,
                createdAt: new Date(),
                modifiedAt: new Date()
            },
            {
                name: "TOKEN LISTRIK - 300.000",
                price: 295000,
                exactCost: 300000,
                quantityStock: 999,
                createdAt: new Date(),
                modifiedAt: new Date()
            },
            {
                name: "TOKEN LISTRIK - 400.000",
                price: 395000,
                exactCost: 400000,
                quantityStock: 999,
                createdAt: new Date(),
                modifiedAt: new Date()
            },
            {
                name: "TOKEN LISTRIK - 500.000",
                price: 495000,
                exactCost: 500000,
                quantityStock: 999,
                createdAt: new Date(),
                modifiedAt: new Date()
            },
        ]
    })

    await prismaClient.token.createMany({
        data: [
            {
                nama: 'TOKEN-001',
                price: 12000,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                nama: 'TOKEN-002',
                price: 12000,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]
    })

    await prismaClient.customer.createMany({
        data: [
            {
                name: 'Customer 1',
                whatsappNumber: '1234567890',
                invoiceNumber: generateUniqueInvoiceNumber(),
                tokenId: 1, // Sesuaikan dengan ID token yang sesuai
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Customer 2',
                whatsappNumber: '9876543210',
                invoiceNumber: generateUniqueInvoiceNumber(),
                tokenId: 2, // Sesuaikan dengan ID token yang sesuai
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]
    })
}


main()

    .then(async () => {

        await prismaClient.$disconnect()

    })

    .catch(async (e) => {

        console.error(e)

        await prismaClient.$disconnect()

        process.exit(1)

    })