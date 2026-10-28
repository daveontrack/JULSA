import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'
import { getPool } from '@/lib/db'

const globalForPrisma = globalThis as typeof globalThis & {
  julsaPrisma?: PrismaClient
}

export function getPrisma() {
  if (!globalForPrisma.julsaPrisma) {
    const adapter = new PrismaPg(getPool())
    globalForPrisma.julsaPrisma = new PrismaClient({ adapter })
  }

  return globalForPrisma.julsaPrisma
}
