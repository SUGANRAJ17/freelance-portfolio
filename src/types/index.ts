export type ReviewStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"

export interface Project {
  id: number
  title: string
  description: string
  imageUrl: string | null
  liveUrl: string | null
  githubUrl: string | null
  technologies: string
  featured: boolean
  createdAt: string
}

export interface Review {
  id: number
  clientName: string
  clientRole: string | null
  rating: number
  message: string
  projectId: number | null
  status: ReviewStatus
  createdAt: string
}

export interface ContactMessage {
  id: number
  name: string
  phone: string | null
  email: string
  subject: string
  message: string
  createdAt: string
}

export interface AdminLoginResponse {
  token: string
  message?: string
}

export interface ProjectsResponse {
  projects: Project[]
}

export interface ReviewsResponse {
  reviews: Review[]
}

export interface ContactResponse {
  message: string
}

export interface ReviewSubmitResponse {
  message: string
  review?: Review
}