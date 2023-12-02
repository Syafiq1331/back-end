const prisma = require('@prisma/client')
const { PrismaClient } = prisma

module.exports = {
    prismaClient: new PrismaClient()
} 
