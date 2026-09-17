import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import helmet from "helmet"

import healthRoutes from "./routes/health.routes.js"
import contactRoutes from "./routes/contact.routes.js"
import authRoutes from "./routes/auth.routes.js"
import adminRoutes from "./routes/admin.routes.js"
import reviewRoutes from "./routes/review.routes.js"
import adminReviewRoutes from "./routes/admin-review.routes.js"
import projectRoutes from "./routes/project.routes.js"

dotenv.config()

const app = express()

const PORT = process.env.PORT || 5000

/* ======================================================
   SECURITY HEADERS
====================================================== */

app.use(
  helmet()
)

/* ======================================================
   CORS CONFIGURATION
====================================================== */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
]

const productionFrontendUrl =
  process.env.FRONTEND_URL?.trim()

if (productionFrontendUrl) {
  allowedOrigins.push(
    productionFrontendUrl
  )
}

app.use(
  cors({
    origin: (
      origin,
      callback
    ) => {
      /*
       * Allow requests without an Origin header.
       *
       * Useful for:
       * - Postman
       * - server-to-server requests
       * - health checks
       */
      if (!origin) {
        return callback(null, true)
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      console.warn(
        `Blocked CORS request from: ${origin}`
      )

      return callback(
        new Error("Not allowed by CORS")
      )
    },

    methods: [
      "GET",
      "POST",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
)

/* ======================================================
   BODY PARSER
====================================================== */

app.use(
  express.json()
)

/* ======================================================
   PUBLIC ROUTES
====================================================== */

app.use(
  "/api/health",
  healthRoutes
)

app.use(
  "/api/contact",
  contactRoutes
)

app.use(
  "/api/auth",
  authRoutes
)

app.use(
  "/api/reviews",
  reviewRoutes
)

app.use(
  "/api/projects",
  projectRoutes
)

/* ======================================================
   PROTECTED ADMIN ROUTES
====================================================== */

app.use(
  "/api/admin",
  adminRoutes
)

app.use(
  "/api/admin/reviews",
  adminReviewRoutes
)

/* ======================================================
   START SERVER
====================================================== */

app.listen(
  PORT,
  () => {
    console.log(
      `Server running on http://localhost:${PORT}`
    )

    console.log(
      "Allowed CORS origins:",
      allowedOrigins
    )
  }
)