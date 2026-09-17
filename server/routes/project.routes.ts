import { Router } from "express"
import { prisma } from "../lib/prisma.js"
import { authenticateAdmin } from "../middleware/auth.middleware.js"
import upload from "../middleware/upload.middleware.js"
import { uploadToCloudinary } from "../lib/cloudinary-upload.js"

const router = Router()

// ========================================
// GET - Public: Get all projects
// ========================================

router.get("/", async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [
        {
          featured: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    })

    return res.status(200).json({
      success: true,
      projects,
    })
  } catch (error) {
    console.error("Get projects error:", error)

    return res.status(500).json({
      success: false,
      message: "Unable to fetch projects",
    })
  }
})

// ========================================
// GET - Public: Get single project
// ========================================

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      })
    }

    const project = await prisma.project.findUnique({
      where: {
        id,
      },
    })

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      })
    }

    return res.status(200).json({
      success: true,
      project,
    })
  } catch (error) {
    console.error("Get project error:", error)

    return res.status(500).json({
      success: false,
      message: "Unable to fetch project",
    })
  }
})

// ========================================
// POST - Admin: Create project
// ========================================

router.post(
  "/",
  authenticateAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        title,
        description,
        imageUrl,
        liveUrl,
        githubUrl,
        technologies,
        featured,
      } = req.body

      if (!title || !description || !technologies) {
        return res.status(400).json({
          success: false,
          message:
            "Title, description, and technologies are required",
        })
      }

      const cleanTitle = String(title).trim()

      const cleanDescription =
        String(description).trim()

      const cleanTechnologies =
        String(technologies).trim()

      // ========================================
      // Upload image to Cloudinary
      // ========================================

      let cleanImageUrl: string | null = null

      if (req.file) {
        const uploadedImage =
          await uploadToCloudinary(
            req.file.buffer
          )

        cleanImageUrl =
          uploadedImage.secure_url
      } else if (imageUrl) {
        // Keep support for an image URL
        // if no file is uploaded.
        cleanImageUrl =
          String(imageUrl).trim()
      }

      const cleanLiveUrl = liveUrl
        ? String(liveUrl).trim()
        : null

      const cleanGithubUrl = githubUrl
        ? String(githubUrl).trim()
        : null

      if (
        !cleanTitle ||
        !cleanDescription ||
        !cleanTechnologies
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Title, description, and technologies are required",
        })
      }

      if (cleanTitle.length > 150) {
        return res.status(400).json({
          success: false,
          message: "Project title is too long",
        })
      }

      if (cleanDescription.length > 5000) {
        return res.status(400).json({
          success: false,
          message:
            "Project description is too long",
        })
      }

      if (cleanTechnologies.length > 500) {
        return res.status(400).json({
          success: false,
          message:
            "Technologies list is too long",
        })
      }

      if (
        cleanImageUrl &&
        cleanImageUrl.length > 1000
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Image URL is too long",
        })
      }

      if (
        cleanLiveUrl &&
        cleanLiveUrl.length > 1000
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Live URL is too long",
        })
      }

      if (
        cleanGithubUrl &&
        cleanGithubUrl.length > 1000
      ) {
        return res.status(400).json({
          success: false,
          message:
            "GitHub URL is too long",
        })
      }

      const project =
        await prisma.project.create({
          data: {
            title: cleanTitle,
            description: cleanDescription,
            imageUrl: cleanImageUrl,
            liveUrl: cleanLiveUrl,
            githubUrl: cleanGithubUrl,
            technologies: cleanTechnologies,
            featured: featured === "true",
          },
        })

      return res.status(201).json({
        success: true,
        message:
          "Project created successfully",
        project,
      })
    } catch (error) {
      console.error(
        "Create project error:",
        error
      )

      return res.status(500).json({
        success: false,
        message: "Unable to create project",
      })
    }
  }
)

// ========================================
// PATCH - Admin: Update project
// ========================================

router.patch(
  "/:id",
  authenticateAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const id = Number(req.params.id)

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID",
        })
      }

      const existingProject =
        await prisma.project.findUnique({
          where: {
            id,
          },
        })

      if (!existingProject) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        })
      }

      const {
        title,
        description,
        imageUrl,
        liveUrl,
        githubUrl,
        technologies,
        featured,
      } = req.body

      const updateData: {
        title?: string
        description?: string
        imageUrl?: string | null
        liveUrl?: string | null
        githubUrl?: string | null
        technologies?: string
        featured?: boolean
      } = {}

      if (title !== undefined) {
        const cleanTitle =
          String(title).trim()

        if (!cleanTitle) {
          return res.status(400).json({
            success: false,
            message:
              "Project title cannot be empty",
          })
        }

        if (cleanTitle.length > 150) {
          return res.status(400).json({
            success: false,
            message:
              "Project title is too long",
          })
        }

        updateData.title = cleanTitle
      }

      if (description !== undefined) {
        const cleanDescription =
          String(description).trim()

        if (!cleanDescription) {
          return res.status(400).json({
            success: false,
            message:
              "Project description cannot be empty",
          })
        }

        if (cleanDescription.length > 5000) {
          return res.status(400).json({
            success: false,
            message:
              "Project description is too long",
          })
        }

        updateData.description =
          cleanDescription
      }

      if (technologies !== undefined) {
        const cleanTechnologies =
          String(technologies).trim()

        if (!cleanTechnologies) {
          return res.status(400).json({
            success: false,
            message:
              "Technologies cannot be empty",
          })
        }

        if (cleanTechnologies.length > 500) {
          return res.status(400).json({
            success: false,
            message:
              "Technologies list is too long",
          })
        }

        updateData.technologies =
          cleanTechnologies
      }

      // ========================================
      // Upload new image if provided
      // ========================================

      if (req.file) {
        const uploadedImage =
          await uploadToCloudinary(
            req.file.buffer
          )

        updateData.imageUrl =
          uploadedImage.secure_url
      } else if (imageUrl !== undefined) {
        updateData.imageUrl = imageUrl
          ? String(imageUrl).trim()
          : null
      }

      if (liveUrl !== undefined) {
        updateData.liveUrl = liveUrl
          ? String(liveUrl).trim()
          : null
      }

      if (githubUrl !== undefined) {
        updateData.githubUrl = githubUrl
          ? String(githubUrl).trim()
          : null
      }

      if (featured !== undefined) {

        updateData.featured =

        featured === "true"
      }

      if (
        Object.keys(updateData).length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "No fields to update",
        })
      }

      const project =
        await prisma.project.update({
          where: {
            id,
          },
          data: updateData,
        })

      return res.status(200).json({
        success: true,
        message:
          "Project updated successfully",
        project,
      })
    } catch (error) {
      console.error(
        "Update project error:",
        error
      )

      return res.status(500).json({
        success: false,
        message: "Unable to update project",
      })
    }
  }
)

// ========================================
// DELETE - Admin: Delete project
// ========================================

router.delete(
  "/:id",
  authenticateAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id)

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID",
        })
      }

      const existingProject =
        await prisma.project.findUnique({
          where: {
            id,
          },
        })

      if (!existingProject) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        })
      }

      await prisma.project.delete({
        where: {
          id,
        },
      })

      return res.status(200).json({
        success: true,
        message:
          "Project deleted successfully",
      })
    } catch (error) {
      console.error(
        "Delete project error:",
        error
      )

      return res.status(500).json({
        success: false,
        message:
          "Unable to delete project",
      })
    }
  }
)

export default router