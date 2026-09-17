import { Router } from "express"
import { prisma } from "../lib/prisma.js"
import { authenticateAdmin } from "../middleware/auth.middleware.js"

const router = Router()

// GET - Admin views all contact messages
router.get(
  "/messages",
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
        "Get contact messages error:",
        error
      )

      return res.status(500).json({
        success: false,
        message: "Failed to fetch contact messages",
      })
    }
  }
)

// DELETE - Admin deletes a contact message
router.delete(
  "/messages/:id",
  authenticateAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id)

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid message ID",
        })
      }

      const existingMessage =
        await prisma.contactMessage.findUnique({
          where: {
            id,
          },
        })

      if (!existingMessage) {
        return res.status(404).json({
          success: false,
          message: "Contact message not found",
        })
      }

      await prisma.contactMessage.delete({
        where: {
          id,
        },
      })

      return res.status(200).json({
        success: true,
        message: "Contact message deleted successfully",
      })
    } catch (error) {
      console.error(
        "Delete contact message error:",
        error
      )

      return res.status(500).json({
        success: false,
        message: "Unable to delete contact message",
      })
    }
  }
)

export default router