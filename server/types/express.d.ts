import { JwtPayload } from "jsonwebtoken"

declare global {
  namespace Express {
    interface Request {
      admin?: JwtPayload & {
        adminId: number
        email: string
      }
    }
  }
}

export {}