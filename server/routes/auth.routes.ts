import { Router } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import { prisma } from "../lib/prisma.js"

import { loginRateLimiter } from "../middleware/loginRateLimit.middleware.js"

const router = Router()

router.post(
  "/login",
  loginRateLimiter,
  async (req, res) => {
    try {
      const { email, password } = req.body

      // Check required fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message:
            "Email and password are required",
        })
      }

      const cleanEmail = String(email)
        .trim()
        .toLowerCase()

      const cleanPassword = String(password)

      // Find admin
      const admin = await prisma.admin.findUnique({
        where: {
          email: cleanEmail,
        },
      })

      /*
       * Always return the same message when
       * authentication fails.
       *
       * This prevents revealing whether an
       * admin email exists in the database.
       */
      if (!admin) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid email or password",
        })
      }

      // Compare password with stored hash
      const passwordMatch =
        await bcrypt.compare(
          cleanPassword,
          admin.passwordHash
        )

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid email or password",
        })
      }

      // Check JWT secret
      const jwtSecret =
        process.env.JWT_SECRET

      if (!jwtSecret) {
        console.error(
          "JWT_SECRET is not configured"
        )

        return res.status(500).json({
          success: false,
          message:
            "Authentication service is not configured",
        })
      }

      // Create JWT
      const token = jwt.sign(
        {
          adminId: admin.id,
          email: admin.email,
        },
        jwtSecret,
        {
          expiresIn: "1h",
        }
      )

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
      })
    } catch (error) {
      console.error(
        "Login error:",
        error
      )

      return res.status(500).json({
        success: false,
        message: "Unable to login",
      })
    }
  }
)

export default router