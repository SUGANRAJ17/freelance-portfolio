import type {
  AdminLoginResponse,
  ContactMessage,
  ContactResponse,
  Project,
  ProjectsResponse,
  Review,
  ReviewsResponse,
  ReviewSubmitResponse,
} from "../types"

/* ======================================================
   API CONFIG
====================================================== */

const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  console.warn(
    "VITE_API_URL is not configured."
  )
}

/* ======================================================
   API ERROR
====================================================== */

export class ApiError extends Error {
  status: number

  constructor(
    message: string,
    status: number
  ) {
    super(message)

    this.name = "ApiError"
    this.status = status
  }
}

/* ======================================================
   RESPONSE TYPES
====================================================== */

interface MessageListResponse {
  messages: ContactMessage[]
}

interface MessageDeleteResponse {
  message: string
}

interface AdminReviewUpdateResponse {
  message: string
  review?: Review
}

interface AdminReviewDeleteResponse {
  message: string
}

interface ProjectMutationResponse {
  message: string
  project?: Project
}

/* ======================================================
   RESPONSE HANDLER
====================================================== */

async function handleResponse<T>(
  response: Response
): Promise<T> {
  let data: unknown = null

  try {
    data = await response.json()
  } catch {
    if (!response.ok) {
      throw new ApiError(
        "Invalid server response",
        response.status
      )
    }

    return {} as T
  }

  if (!response.ok) {
    let message = "Something went wrong"

    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      message = data.message
    }

    throw new ApiError(
      message,
      response.status
    )
  }

  return data as T
}

/* ======================================================
   AUTH HELPERS
====================================================== */

/**
 * Get the currently stored admin JWT.
 */
export function getAdminToken(): string | null {
  return localStorage.getItem("adminToken")
}

/**
 * Remove the admin JWT.
 */
export function clearAdminToken(): void {
  localStorage.removeItem("adminToken")
}

/**
 * Build the Authorization header for
 * protected admin requests.
 */
function getAuthorizationHeader(): {
  Authorization: string
} {
  const token = getAdminToken()

  if (!token) {
    throw new ApiError(
      "Authentication required",
      401
    )
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

/* ======================================================
   ADMIN FETCH HELPER
====================================================== */

/**
 * Send an authenticated request to the backend.
 *
 * If the backend returns 401, the stored admin token
 * is immediately removed because it is no longer valid.
 */
async function adminFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const authHeader =
    getAuthorizationHeader()

  const headers = new Headers(
    options.headers
  )

  headers.set(
    "Authorization",
    authHeader.Authorization
  )

  let response: Response

  try {
    response = await fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    )
  } catch (error) {
    console.error(
      "API request failed:",
      error
    )

    throw new ApiError(
      "Unable to connect to the server",
      0
    )
  }

  /*
   * The backend uses 401 when:
   * - token is missing
   * - token is invalid
   * - token is expired
   *
   * Remove the stale token immediately.
   */
  if (response.status === 401) {
    clearAdminToken()
  }

  return handleResponse<T>(response)
}

/* ======================================================
   PROJECTS - PUBLIC
====================================================== */

export async function getProjects(): Promise<ProjectsResponse> {
  const response = await fetch(
    `${API_URL}/api/projects`
  )

  return handleResponse<ProjectsResponse>(
    response
  )
}

/* ======================================================
   REVIEWS - PUBLIC
====================================================== */

export async function getReviews(): Promise<ReviewsResponse> {
  const response = await fetch(
    `${API_URL}/api/reviews`
  )

  return handleResponse<ReviewsResponse>(
    response
  )
}

/* ======================================================
   SUBMIT REVIEW - PUBLIC
====================================================== */

export async function submitReview(
  review: {
    clientName: string
    clientRole: string
    rating: number
    message: string
  }
): Promise<ReviewSubmitResponse> {
  const response = await fetch(
    `${API_URL}/api/reviews`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(review),
    }
  )

  return handleResponse<ReviewSubmitResponse>(
    response
  )
}

/* ======================================================
   CONTACT - PUBLIC
====================================================== */

export async function submitContactMessage(
  data: {
    name: string
    phone: string
    email: string
    subject: string
    message: string
  }
): Promise<ContactResponse> {
  const response = await fetch(
    `${API_URL}/api/contact`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    }
  )

  return handleResponse<ContactResponse>(
    response
  )
}

/* ======================================================
   ADMIN AUTH - LOGIN
====================================================== */

export async function adminLogin(
  email: string,
  password: string
): Promise<AdminLoginResponse> {
  const response = await fetch(
    `${API_URL}/api/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        password,
      }),
    }
  )

  return handleResponse<AdminLoginResponse>(
    response
  )
}

/* ======================================================
   ADMIN - CONTACT MESSAGES
====================================================== */

/**
 * Get all contact messages.
 */
export async function getAdminMessages(): Promise<MessageListResponse> {
  return adminFetch<MessageListResponse>(
    "/api/admin/messages"
  )
}

/**
 * Delete one contact message.
 */
export async function deleteAdminMessage(
  messageId: number
): Promise<MessageDeleteResponse> {
  return adminFetch<MessageDeleteResponse>(
    `/api/admin/messages/${messageId}`,
    {
      method: "DELETE",
    }
  )
}

/* ======================================================
   ADMIN - REVIEWS
====================================================== */

export type ReviewStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"

/**
 * Get all reviews for admin dashboard.
 */
export async function getAdminReviews(): Promise<ReviewsResponse> {
  return adminFetch<ReviewsResponse>(
    "/api/admin/reviews"
  )
}

/**
 * Update review status.
 */
export async function updateReviewStatus(
  reviewId: number,
  status: ReviewStatus
): Promise<AdminReviewUpdateResponse> {
  return adminFetch<AdminReviewUpdateResponse>(
    `/api/admin/reviews/${reviewId}/status`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        status,
      }),
    }
  )
}

/**
 * Edit an existing review.
 */
export async function updateAdminReview(
  reviewId: number,
  data: {
    clientName: string
    clientRole: string
    rating: number
    message: string
  }
): Promise<AdminReviewUpdateResponse> {
  return adminFetch<AdminReviewUpdateResponse>(
    `/api/admin/reviews/${reviewId}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    }
  )
}

/**
 * Delete an existing review.
 */
export async function deleteAdminReview(
  reviewId: number
): Promise<AdminReviewDeleteResponse> {
  return adminFetch<AdminReviewDeleteResponse>(
    `/api/admin/reviews/${reviewId}`,
    {
      method: "DELETE",
    }
  )
}

/* ======================================================
   ADMIN - PROJECTS
====================================================== */

/**
 * Create or update a project.
 *
 * The backend expects multipart/form-data because
 * project images are uploaded through Cloudinary.
 */
export async function saveAdminProject(
  data: {
    id?: number | null
    title: string
    description: string
    liveUrl: string
    githubUrl: string
    technologies: string
    featured: boolean
    image?: File | null
  }
): Promise<ProjectMutationResponse> {
  const formData = new FormData()

  formData.append(
    "title",
    data.title.trim()
  )

  formData.append(
    "description",
    data.description.trim()
  )

  formData.append(
    "liveUrl",
    data.liveUrl.trim()
  )

  formData.append(
    "githubUrl",
    data.githubUrl.trim()
  )

  formData.append(
    "technologies",
    data.technologies.trim()
  )

  formData.append(
    "featured",
    String(data.featured)
  )

  if (data.image) {
    formData.append(
      "image",
      data.image
    )
  }

  const endpoint = data.id
    ? `/api/projects/${data.id}`
    : "/api/projects"

  const method = data.id
    ? "PATCH"
    : "POST"

  return adminFetch<ProjectMutationResponse>(
    endpoint,
    {
      method,
      body: formData,
    }
  )
}

/**
 * Delete a project.
 */
export async function deleteAdminProject(
  projectId: number
): Promise<ProjectMutationResponse> {
  return adminFetch<ProjectMutationResponse>(
    `/api/projects/${projectId}`,
    {
      method: "DELETE",
    }
  )
}