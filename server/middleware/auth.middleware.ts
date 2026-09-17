import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

interface JwtPayload {
  adminId: number
  email: string
  iat?: number
  exp?: number
}

export function authenticateAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required",
      })
    }

    // Expected format:
    // Authorization: Bearer YOUR_TOKEN
    const [scheme, token] = authHeader.split(" ")

    if (
      scheme !== "Bearer" ||
      !token ||
      authHeader.split(" ").length !== 2
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      })
    }

    // Get JWT secret
    const jwtSecret = process.env.JWT_SECRET

    if (!jwtSecret) {
      console.error(
        "JWT_SECRET is not configured"
      )

      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      })
    }

    // Verify JWT
    const decoded = jwt.verify(
      token,
      jwtSecret
    )

    // Make sure decoded value is an object
    if (
      typeof decoded !== "object" ||
      decoded === null
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      })
    }

    const payload = decoded as JwtPayload

    // Validate required admin information
    if (
      typeof payload.adminId !== "number" ||
      !Number.isInteger(payload.adminId) ||
      payload.adminId <= 0 ||
      typeof payload.email !== "string" ||
      !payload.email.trim()
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      })
    }

    // Store authenticated admin information
    req.admin = {
      adminId: payload.adminId,
      email: payload.email,
    }

    // Continue to protected route
    next()
  } catch (error) {
    console.error(
      "Authentication error:",
      error
    )

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    })
  }
}