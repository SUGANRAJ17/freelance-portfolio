import { Router } from "express"

import { prisma } from "../lib/prisma.js"

const router = Router()

// ======================================================
// VALIDATION HELPERS
// ======================================================

function isValidRating(
  rating: number
): boolean {
  return (
    Number.isInteger(rating) &&
    rating >= 1 &&
    rating <= 5
  )
}

// ======================================================
// POST - Client submits a review
// ======================================================

router.post("/", async (req, res) => {
  const {
    clientName,
    clientRole,
    rating,
    message,
    projectId,
  } = req.body

  // ======================================================
  // REQUEST BODY TYPE VALIDATION
  // ======================================================

  if (
    typeof clientName !== "string" ||
    typeof message !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Client name and message are required",
    })
  }

  // Rating must be a number
  if (typeof rating !== "number") {
    return res.status(400).json({
      success: false,
      message:
        "Rating must be a number between 1 and 5",
    })
  }

  // clientRole is optional, but if provided,
  // it must be a string
  if (
    clientRole !== undefined &&
    clientRole !== null &&
    typeof clientRole !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid client role",
    })
  }

  // projectId is optional
  if (
    projectId !== undefined &&
    projectId !== null &&
    projectId !== "" &&
    typeof projectId !== "number"
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid project ID",
    })
  }

  // ======================================================
  // CLEAN INPUT
  // ======================================================

  const cleanName =
    clientName.trim()

  const cleanRole =
    typeof clientRole === "string"
      ? clientRole.trim()
      : null

  const cleanMessage =
    message.trim()

  // ======================================================
  // EMPTY VALUE VALIDATION
  // ======================================================

  if (
    !cleanName ||
    !cleanMessage
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Client name and message are required",
    })
  }

  // ======================================================
  // RATING VALIDATION
  // ======================================================

  if (!isValidRating(rating)) {
    return res.status(400).json({
      success: false,
      message:
        "Rating must be between 1 and 5",
    })
  }

  // ======================================================
  // NAME LENGTH VALIDATION
  // ======================================================

  if (cleanName.length > 100) {
    return res.status(400).json({
      success: false,
      message:
        "Client name is too long",
    })
  }

  // ======================================================
  // ROLE LENGTH VALIDATION
  // ======================================================

  if (
    cleanRole &&
    cleanRole.length > 100
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Client role is too long",
    })
  }

  // ======================================================
  // MESSAGE LENGTH VALIDATION
  // ======================================================

  if (cleanMessage.length > 2000) {
    return res.status(400).json({
      success: false,
      message:
        "Review message is too long",
    })
  }

  // ======================================================
  // PROJECT ID VALIDATION
  // ======================================================

  let cleanProjectId:
    number | null = null

  if (
    projectId !== undefined &&
    projectId !== null &&
    projectId !== ""
  ) {
    if (
      !Number.isInteger(projectId) ||
      projectId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid project ID",
      })
    }

    cleanProjectId = projectId
  }

  // ======================================================
  // SAVE REVIEW
  // ======================================================

  try {
    const review =
      await prisma.review.create({
        data: {
          clientName: cleanName,

          clientRole: cleanRole,

          rating,

          message: cleanMessage,

          projectId:
            cleanProjectId,

          // Every public review starts
          // as pending moderation.
          status: "PENDING",
        },
      })

    return res.status(201).json({
      success: true,
      message:
        "Review submitted successfully and is awaiting approval",

      review: {
        id: review.id,
        status: review.status,
      },
    })
  } catch (error) {
    console.error(
      "Create review error:",
      error
    )

    return res.status(500).json({
      success: false,
      message:
        "Unable to submit review",
    })
  }
})

// ======================================================
// GET - Public approved reviews
// ======================================================

router.get("/", async (req, res) => {
  try {
    const reviews =
      await prisma.review.findMany({
        where: {
          status: "APPROVED",
        },

        orderBy: {
          createdAt: "desc",
        },
      })

    return res.status(200).json({
      success: true,
      reviews,
    })
  } catch (error) {
    console.error(
      "Get public reviews error:",
      error
    )

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch reviews",
    })
  }
})

// ======================================================
// EXPORT
// ======================================================

export default router