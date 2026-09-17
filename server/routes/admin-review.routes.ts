import { Router } from "express"
import { prisma } from "../lib/prisma.js"
import { authenticateAdmin } from "../middleware/auth.middleware.js"

const router = Router()

// GET - Admin views all reviews
router.get(
  "/",
  authenticateAdmin,
  async (req, res) => {
    try {
      const reviews = await prisma.review.findMany({
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
        "Get admin reviews error:",
        error
      )

      return res.status(500).json({
        success: false,
        message: "Unable to fetch reviews",
      })
    }
  }
)

// PATCH - Admin updates review status
router.patch(
  "/:id/status",
  authenticateAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id)
      const { status } = req.body

      // Validate ID
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid review ID",
        })
      }

      // Validate status
      const allowedStatuses = [
        "PENDING",
        "APPROVED",
        "REJECTED",
      ]

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid review status",
        })
      }

      // Check review exists
      const existingReview =
        await prisma.review.findUnique({
          where: {
            id,
          },
        })

      if (!existingReview) {
        return res.status(404).json({
          success: false,
          message: "Review not found",
        })
      }

      // Update status
      const review = await prisma.review.update({
        where: {
          id,
        },
        data: {
          status,
        },
      })

      return res.status(200).json({
        success: true,
        message: `Review ${status.toLowerCase()} successfully`,
        review,
      })
    } catch (error) {
      console.error(
        "Update review status error:",
        error
      )

      return res.status(500).json({
        success: false,
        message: "Unable to update review status",
      })
    }
  }
)

// PATCH - Admin edits review
router.patch(
  "/:id",
  authenticateAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id)

      const {
        clientName,
        clientRole,
        rating,
        message,
        projectId,
      } = req.body

      // Validate ID
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid review ID",
        })
      }

      // Check review exists
      const existingReview =
        await prisma.review.findUnique({
          where: {
            id,
          },
        })

      if (!existingReview) {
        return res.status(404).json({
          success: false,
          message: "Review not found",
        })
      }

      // Prepare update data
      const updateData: {
        clientName?: string
        clientRole?: string | null
        rating?: number
        message?: string
        projectId?: number | null
      } = {}

      // Client name
      if (clientName !== undefined) {
        const cleanName =
          String(clientName).trim()

        if (!cleanName) {
          return res.status(400).json({
            success: false,
            message: "Client name cannot be empty",
          })
        }

        if (cleanName.length > 100) {
          return res.status(400).json({
            success: false,
            message: "Client name is too long",
          })
        }

        updateData.clientName = cleanName
      }

      // Client role
      if (clientRole !== undefined) {
        const cleanRole = clientRole
          ? String(clientRole).trim()
          : null

        if (
          cleanRole &&
          cleanRole.length > 100
        ) {
          return res.status(400).json({
            success: false,
            message: "Client role is too long",
          })
        }

        updateData.clientRole = cleanRole
      }

      // Rating
      if (rating !== undefined) {
        const cleanRating = Number(rating)

        if (
          !Number.isInteger(cleanRating) ||
          cleanRating < 1 ||
          cleanRating > 5
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Rating must be between 1 and 5",
          })
        }

        updateData.rating = cleanRating
      }

      // Message
      if (message !== undefined) {
        const cleanMessage =
          String(message).trim()

        if (!cleanMessage) {
          return res.status(400).json({
            success: false,
            message: "Review message cannot be empty",
          })
        }

        if (cleanMessage.length > 2000) {
          return res.status(400).json({
            success: false,
            message: "Review message is too long",
          })
        }

        updateData.message = cleanMessage
      }

      // Project ID
      if (projectId !== undefined) {
        if (
          projectId === null ||
          projectId === ""
        ) {
          updateData.projectId = null
        } else {
          const cleanProjectId =
            Number(projectId)

          if (
            !Number.isInteger(cleanProjectId) ||
            cleanProjectId <= 0
          ) {
            return res.status(400).json({
              success: false,
              message: "Invalid project ID",
            })
          }

          updateData.projectId = cleanProjectId
        }
      }

      // Make sure something is being updated
      if (
        Object.keys(updateData).length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "No fields to update",
        })
      }

      const review = await prisma.review.update({
        where: {
          id,
        },
        data: updateData,
      })

      return res.status(200).json({
        success: true,
        message: "Review updated successfully",
        review,
      })
    } catch (error) {
      console.error(
        "Edit review error:",
        error
      )

      return res.status(500).json({
        success: false,
        message: "Unable to update review",
      })
    }
  }
)

// DELETE - Admin deletes a review
router.delete(
  "/:id",
  authenticateAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id)

      // Validate ID
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid review ID",
        })
      }

      // Check review exists
      const existingReview =
        await prisma.review.findUnique({
          where: {
            id,
          },
        })

      if (!existingReview) {
        return res.status(404).json({
          success: false,
          message: "Review not found",
        })
      }

      // Delete review
      await prisma.review.delete({
        where: {
          id,
        },
      })

      return res.status(200).json({
        success: true,
        message: "Review deleted successfully",
      })
    } catch (error) {
      console.error(
        "Delete review error:",
        error
      )

      return res.status(500).json({
        success: false,
        message: "Unable to delete review",
      })
    }
  }
)

export default router