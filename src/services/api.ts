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

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()

const API_URL = import.meta.env.PROD
  ? configuredApiUrl &&
    !configuredApiUrl.includes("localhost") &&
    !configuredApiUrl.includes("127.0.0.1")
    ? configuredApiUrl
    : "https://freelance-portfolio-api-dngj.onrender.com"
  : configuredApiUrl || "http://localhost:5000"

if (!configuredApiUrl) {
  console.warn("VITE_API_URL is not configured.")
}

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

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  let data: unknown = null

  try {
    data = await response.json()
  } catch {
    if (!response.ok) {
      throw new ApiError("Invalid server response", response.status)
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

    throw new ApiError(message, response.status)
  }

  return data as T
}

export function getAdminToken(): string | null {
  return localStorage.getItem("adminToken")
}

export function clearAdminToken(): void {
  localStorage.removeItem("adminToken")
}

function getAuthorizationHeader(): { Authorization: string } {
  const token = getAdminToken()

  if (!token) {
    throw new ApiError("Authentication required", 401)
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

async function adminFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const authHeader = getAuthorizationHeader()

  const headers = new Headers(options.headers)

  headers.set("Authorization", authHeader.Authorization)

  let response: Response

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })
  } catch (error) {
    console.error("API request failed:", error)

    throw new ApiError("Unable to connect to the server", 0)
  }

  if (response.status === 401) {
    clearAdminToken()
  }

  return handleResponse<T>(response)
}

export async function getProjects(): Promise<ProjectsResponse> {
  const response = await fetch(`${API_URL}/api/projects`)

  return handleResponse<ProjectsResponse>(response)
}

export async function getReviews(): Promise<ReviewsResponse> {
  const response = await fetch(`${API_URL}/api/reviews`)

  return handleResponse<ReviewsResponse>(response)
}

export async function submitReview(review: {
  clientName: string
  clientRole: string
  rating: number
  message: string
}): Promise<ReviewSubmitResponse> {
  const response = await fetch(`${API_URL}/api/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(review),
  })

  return handleResponse<ReviewSubmitResponse>(response)
}

export async function submitContactMessage(data: {
  name: string
  phone: string
  email: string
  subject: string
  message: string
}): Promise<ContactResponse> {
  const response = await fetch(`${API_URL}/api/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  return handleResponse<ContactResponse>(response)
}

export async function adminLogin(
  email: string,
  password: string
): Promise<AdminLoginResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })

  return handleResponse<AdminLoginResponse>(response)
}

export async function getAdminMessages(): Promise<MessageListResponse> {
  return adminFetch<MessageListResponse>("/api/admin/messages")
}

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

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED"

export async function getAdminReviews(): Promise<ReviewsResponse> {
  return adminFetch<ReviewsResponse>("/api/admin/reviews")
}

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

export async function saveAdminProject(data: {
  id?: number | null
  title: string
  description: string
  liveUrl: string
  githubUrl: string
  technologies: string
  featured: boolean
  image?: File | null
}): Promise<ProjectMutationResponse> {
  const formData = new FormData()

  formData.append("title", data.title.trim())
  formData.append("description", data.description.trim())
  formData.append("liveUrl", data.liveUrl.trim())
  formData.append("githubUrl", data.githubUrl.trim())
  formData.append("technologies", data.technologies.trim())
  formData.append("featured", String(data.featured))

  if (data.image) {
    formData.append("image", data.image)
  }

  const endpoint = data.id
    ? `/api/projects/${data.id}`
    : "/api/projects"

  const method = data.id ? "PATCH" : "POST"

  return adminFetch<ProjectMutationResponse>(endpoint, {
    method,
    body: formData,
  })
}

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