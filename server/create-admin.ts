import "dotenv/config"
import bcrypt from "bcryptjs"
import { prisma } from "./lib/prisma.js"

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD are required in server/.env"
    )
  }

  const existingAdmin = await prisma.admin.findUnique({
    where: {
      email,
    },
  })

  if (existingAdmin) {
    console.log("Admin account already exists.")
    return
  }

  const passwordHash = await bcrypt.hash(password, 12)

  await prisma.admin.create({
    data: {
      email,
      passwordHash,
    },
  })

  console.log("Admin account created successfully.")
}

createAdmin()
  .catch((error) => {
    console.error("Error creating admin:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })