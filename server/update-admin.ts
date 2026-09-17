import "dotenv/config"
import bcrypt from "bcryptjs"
import { prisma } from "./lib/prisma.js"

async function updateAdmin() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD are required in server/.env"
    )
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const admin = await prisma.admin.update({
    where: {
      email: email.trim().toLowerCase(),
    },
    data: {
      passwordHash,
    },
  })

  console.log(`Admin password updated for: ${admin.email}`)
}

updateAdmin()
  .catch((error) => {
    console.error("Error updating admin:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })