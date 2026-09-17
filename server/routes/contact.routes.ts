import { Router } from "express"

import { prisma } from "../lib/prisma.js"

import { authenticateAdmin } from "../middleware/auth.middleware.js"

const router = Router()

// ======================================================
// VALIDATION HELPERS
// ======================================================

function isValidPhone(phone: string): boolean {
  return /^[0-9]{10}$/.test(phone)
}

function isValidGmail(email: string): boolean {
  return /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]{0,62}[a-zA-Z0-9])?@gmail\.com$/.test(
    email
  )
}

// ======================================================
// POST - Public contact form
// ======================================================

router.post("/", async (req, res) => {
  const {
    name,
    phone,
    email,
    subject,
    message,
  } = req.body

  // Check request body
  if (
    typeof name !== "string" ||
    typeof phone !== "string" ||
    typeof email !== "string" ||
    typeof subject !== "string" ||
    typeof message !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    })
  }

  // Clean input
  const cleanName = name.trim()
  const cleanPhone = phone.trim()
  const cleanEmail = email
    .trim()
    .toLowerCase()
  const cleanSubject = subject.trim()
  const cleanMessage = message.trim()

  // Check empty values
  if (
    !cleanName ||
    !cleanPhone ||
    !cleanEmail ||
    !cleanSubject ||
    !cleanMessage
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    })
  }

  // ======================================================
  // Length validation
  // ======================================================

  if (cleanName.length > 100) {
    return res.status(400).json({
      success: false,
      message: "Name is too long",
    })
  }

  if (cleanPhone.length > 20) {
    return res.status(400).json({
      success: false,
      message: "Phone number is too long",
    })
  }

  if (cleanEmail.length > 150) {
    return res.status(400).json({
      success: false,
      message: "Email address is too long",
    })
  }

  if (cleanSubject.length > 150) {
    return res.status(400).json({
      success: false,
      message: "Subject is too long",
    })
  }

  if (cleanMessage.length > 2000) {
    return res.status(400).json({
      success: false,
      message: "Message is too long",
    })
  }

  // ======================================================
  // Phone validation
  // ======================================================

  if (!isValidPhone(cleanPhone)) {
    return res.status(400).json({
      success: false,
      message:
        "Please provide a valid 10-digit phone number",
    })
  }

  // ======================================================
  // Gmail validation
  // ======================================================

  if (!isValidGmail(cleanEmail)) {
    return res.status(400).json({
      success: false,
      message:
        "Please provide a valid Gmail address",
    })
  }

  // ======================================================
  // Save message to database
  // ======================================================

  try {
    await prisma.contactMessage.create({
      data: {
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        subject: cleanSubject,
        message: cleanMessage,
      },
    })

    return res.status(201).json({
      success: true,
      message:
        "Contact message received successfully",
    })
  } catch (error) {
    console.error(
      "Database error:",
      error
    )

    return res.status(500).json({
      success: false,
      message:
        "Unable to save your message",
    })
  }
})

// ======================================================
// GET - Admin only: all contact messages
// ======================================================

router.get(
  "/",
  authenticateAdmin,
  async (req, res) => {
    try {
      const messages =
        await prisma.contactMessage.findMany({
          orderBy: {
            createdAt: "desc",
          },
        })

      return res.status(200).json({
        success: true,
        messages,
      })
    } catch (error) {
      console.error(
        "Database error:",
        error
      )

      return res.status(500).json({
        success: false,
        message:
          "Unable to fetch contact messages",
      })
    }
  }
)

// ======================================================
// GET - Admin only: single contact message
// ======================================================

router.get(
  "/:id",
  authenticateAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id)

      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid message ID",
        })
      }

      const message =
        await prisma.contactMessage.findUnique({
          where: {
            id,
          },
        })

      if (!message) {
        return res.status(404).json({
          success: false,
          message:
            "Contact message not found",
        })
      }

      return res.status(200).json({
        success: true,
        message,
      })
    } catch (error) {
      console.error(
        "Database error:",
        error
      )

      return res.status(500).json({
        success: false,
        message:
          "Unable to fetch contact message",
      })
    }
  }
)

// ======================================================
// EXPORT
// ======================================================

export default router