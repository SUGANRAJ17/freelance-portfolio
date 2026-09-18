import "dotenv/config"
import bcrypt from "bcryptjs"
import { prisma } from "./lib/prisma.js"

async function updateAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD are required in server/.env"
    )
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const admin = await prisma.admin.upsert({
    where: {
      email,
    },
    update: {
      passwordHash,
    },
    create: {
      email,
      passwordHash,
    },
  })

  console.log(`Admin account ready for: ${admin.email}`)
}

updateAdmin()
  .catch((error) => {
    console.error("Error creating/updating admin:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })