import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  ApiError,
  clearAdminToken,
  deleteAdminMessage,
  deleteAdminProject,
  deleteAdminReview,
  getAdminMessages,
  getAdminReviews,
  getProjects,
  saveAdminProject,
  updateAdminReview,
  updateReviewStatus as updateAdminReviewStatus,
} from "../services/api"

import type {
  ContactMessage,
  Project,
  Review,
} from "../types"

type ReviewStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"

function AdminDashboard() {
  const navigate = useNavigate()

  const [messages, setMessages] = useState<
    ContactMessage[]
  >([])

  const [reviews, setReviews] = useState<Review[]>([])

  const [projects, setProjects] = useState<Project[]>([])

  const [isLoadingMessages, setIsLoadingMessages] =
    useState(true)

  const [isLoadingReviews, setIsLoadingReviews] =
    useState(true)

  const [isLoadingProjects, setIsLoadingProjects] =
    useState(true)

  const [error, setError] = useState("")

  // ==========================================
  // PROJECT FORM
  // ==========================================

  const [showProjectForm, setShowProjectForm] =
    useState(false)

  const [editingProjectId, setEditingProjectId] =
    useState<number | null>(null)

  const [projectTitle, setProjectTitle] = useState("")

  const [projectDescription, setProjectDescription] =
    useState("")

  const [projectImageUrl, setProjectImageUrl] =
    useState("")

  const [projectImage, setProjectImage] =
    useState<File | null>(null)

  const [projectLiveUrl, setProjectLiveUrl] =
    useState("")

  const [projectGithubUrl, setProjectGithubUrl] =
    useState("")

  const [projectTechnologies, setProjectTechnologies] =
    useState("")

  const [projectFeatured, setProjectFeatured] =
    useState(false)

  const [isSavingProject, setIsSavingProject] =
    useState(false)

  // ==========================================
  // REVIEW EDITING
  // ==========================================

  const [editingReviewId, setEditingReviewId] =
    useState<number | null>(null)

  const [editClientName, setEditClientName] =
    useState("")

  const [editClientRole, setEditClientRole] =
    useState("")

  const [editRating, setEditRating] =
    useState(5)

  const [editMessage, setEditMessage] =
    useState("")

  // ==========================================
  // AUTH HELPERS
  // ==========================================

  function handleUnauthorized() {
    clearAdminToken()

    navigate("/admin/login", {
      replace: true,
    })
  }

  // ==========================================
  // FETCH CONTACT MESSAGES
  // ==========================================

  async function fetchMessages() {
    try {
      setIsLoadingMessages(true)

      const data = await getAdminMessages()

      setMessages(data.messages)
    } catch (error) {
      console.error(
        "Fetch messages error:",
        error
      )

      if (error instanceof ApiError && error.status === 401) {
        handleUnauthorized()
        return
      }

      setError(
        error instanceof Error
          ? error.message
          : "Unable to fetch contact messages"
      )
    } finally {
      setIsLoadingMessages(false)
    }
  }

  // ==========================================
  // FETCH REVIEWS
  // ==========================================

  async function fetchReviews() {
    try {
      setIsLoadingReviews(true)

      const data = await getAdminReviews()

      setReviews(data.reviews)
    } catch (error) {
      console.error(
        "Fetch reviews error:",
        error
      )

      if (error instanceof ApiError && error.status === 401) {
        handleUnauthorized()
        return
      }

      setError(
        error instanceof Error
          ? error.message
          : "Unable to fetch reviews"
      )
    } finally {
      setIsLoadingReviews(false)
    }
  }

  // ==========================================
  // FETCH PROJECTS
  // ==========================================

  async function fetchProjects() {
    try {
      setIsLoadingProjects(true)

      const data = await getProjects()

      setProjects(data.projects)
    } catch (error) {
      console.error(
        "Fetch projects error:",
        error
      )

      setError(
        error instanceof Error
          ? error.message
          : "Unable to fetch projects"
      )
    } finally {
      setIsLoadingProjects(false)
    }
  }

  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================

  useEffect(() => {
    fetchMessages()
    fetchReviews()
    fetchProjects()
  }, [])

  // ==========================================
  // DELETE CONTACT MESSAGE
  // ==========================================

  async function deleteContactMessage(
    messageId: number
  ) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this contact message?"
    )

    if (!confirmed) {
      return
    }

    try {
      setError("")

      await deleteAdminMessage(messageId)

      setMessages((currentMessages) =>
        currentMessages.filter(
          (message) =>
            message.id !== messageId
        )
      )
    } catch (error) {
      console.error(
        "Delete contact message error:",
        error
      )

      if (error instanceof ApiError && error.status === 401) {
        handleUnauthorized()
        return
      }

      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete contact message"
      )
    }
  }

  // ==========================================
  // UPDATE REVIEW STATUS
  // ==========================================

  async function updateReviewStatus(
    reviewId: number,
    status: ReviewStatus
  ) {
    try {
      setError("")

      await updateAdminReviewStatus(
        reviewId,
        status
      )

      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                status,
              }
            : review
        )
      )
    } catch (error) {
      console.error(
        "Update review status error:",
        error
      )

      if (error instanceof ApiError && error.status === 401) {
        handleUnauthorized()
        return
      }

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update review"
      )
    }
  }

  // ==========================================
  // START EDIT REVIEW
  // ==========================================

  function startEditReview(review: Review) {
    setEditingReviewId(review.id)

    setEditClientName(review.clientName)

    setEditClientRole(
      review.clientRole || ""
    )

    setEditRating(review.rating)

    setEditMessage(review.message)
  }

  // ==========================================
  // CANCEL EDIT REVIEW
  // ==========================================

  function cancelEditReview() {
    setEditingReviewId(null)

    setEditClientName("")

    setEditClientRole("")

    setEditRating(5)

    setEditMessage("")
  }

  // ==========================================
  // SAVE REVIEW
  // ==========================================

  async function saveReview(reviewId: number) {
    try {
      setError("")

      const data = await updateAdminReview(
        reviewId,
        {
          clientName: editClientName,
          clientRole: editClientRole,
          rating: editRating,
          message: editMessage,
        }
      )

      if (!data.review) {
        throw new Error(
          "Updated review was not returned by the server"
        )
      }

      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          review.id === reviewId
            ? data.review!
            : review
        )
      )

      cancelEditReview()
    } catch (error) {
      console.error(
        "Save review error:",
        error
      )

      if (error instanceof ApiError && error.status === 401) {
        handleUnauthorized()
        return
      }

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update review"
      )
    }
  }

  // ==========================================
  // DELETE REVIEW
  // ==========================================

  async function deleteReview(
    reviewId: number
  ) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    )

    if (!confirmed) {
      return
    }

    try {
      setError("")

      await deleteAdminReview(reviewId)

      setReviews((currentReviews) =>
        currentReviews.filter(
          (review) =>
            review.id !== reviewId
        )
      )
    } catch (error) {
      console.error(
        "Delete review error:",
        error
      )

      if (error instanceof ApiError && error.status === 401) {
        handleUnauthorized()
        return
      }

      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete review"
      )
    }
  }

  // ==========================================
  // RESET PROJECT FORM
  // ==========================================

  function resetProjectForm() {
    setEditingProjectId(null)

    setProjectTitle("")

    setProjectDescription("")

    setProjectImageUrl("")

    setProjectImage(null)

    setProjectLiveUrl("")

    setProjectGithubUrl("")

    setProjectTechnologies("")

    setProjectFeatured(false)

    setShowProjectForm(false)
  }

  // ==========================================
  // START EDIT PROJECT
  // ==========================================

  function startEditProject(
    project: Project
  ) {
    setEditingProjectId(project.id)

    setProjectTitle(project.title)

    setProjectDescription(
      project.description
    )

    setProjectImageUrl(
      project.imageUrl || ""
    )

    setProjectImage(null)

    setProjectLiveUrl(
      project.liveUrl || ""
    )

    setProjectGithubUrl(
      project.githubUrl || ""
    )

    setProjectTechnologies(
      project.technologies
    )

    setProjectFeatured(project.featured)

    setShowProjectForm(true)
  }

  // ==========================================
  // IMAGE SELECTION
  // ==========================================

  function handleProjectImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0]

    if (!file) {
      setProjectImage(null)
      return
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ]

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, PNG, WEBP, and GIF images are allowed."
      )

      event.target.value = ""
      setProjectImage(null)

      return
    }

    const maxSize = 5 * 1024 * 1024

    if (file.size > maxSize) {
      setError(
        "Image size must be 5 MB or smaller."
      )

      event.target.value = ""
      setProjectImage(null)

      return
    }

    setError("")
    setProjectImage(file)
  }

  // ==========================================
  // SAVE PROJECT
  // ==========================================

  async function saveProject(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    try {
      setError("")
      setIsSavingProject(true)

      await saveAdminProject({
        id: editingProjectId,
        title: projectTitle,
        description: projectDescription,
        liveUrl: projectLiveUrl,
        githubUrl: projectGithubUrl,
        technologies: projectTechnologies,
        featured: projectFeatured,
        image: projectImage,
      })

      await fetchProjects()

      resetProjectForm()
    } catch (error) {
      console.error(
        "Save project error:",
        error
      )

      if (error instanceof ApiError && error.status === 401) {
        handleUnauthorized()
        return
      }

      setError(
        error instanceof Error
          ? error.message
          : "Unable to save project"
      )
    } finally {
      setIsSavingProject(false)
    }
  }

  // ==========================================
  // DELETE PROJECT
  // ==========================================

  async function deleteProject(
    projectId: number
  ) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    )

    if (!confirmed) {
      return
    }

    try {
      setError("")

      await deleteAdminProject(projectId)

      setProjects((currentProjects) =>
        currentProjects.filter(
          (project) =>
            project.id !== projectId
        )
      )
    } catch (error) {
      console.error(
        "Delete project error:",
        error
      )

      if (error instanceof ApiError && error.status === 401) {
        handleUnauthorized()
        return
      }

      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete project"
      )
    }
  }

  // ==========================================
  // LOGOUT
  // ==========================================

  function handleLogout() {
    console.log("LOGOUT CLICKED")

    clearAdminToken()

    console.log(
      "TOKEN AFTER LOGOUT:",
      localStorage.getItem("adminToken")
    )

    window.location.replace("/admin/login")
  }

  // ==========================================
  // DASHBOARD UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}

      <header className="border-b border-white/10 bg-slate-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
              Admin
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              Portfolio Dashboard
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Error */}

        {error && (
          <div
            role="alert"
            className="mb-8 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400"
          >
            {error}
          </div>
        )}

        {/* Dashboard Stats */}

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-500">
              Contact Messages
            </p>

            <p className="mt-2 text-3xl font-bold text-white">
              {messages.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-500">
              Reviews
            </p>

            <p className="mt-2 text-3xl font-bold text-white">
              {reviews.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-500">
              Projects
            </p>

            <p className="mt-2 text-3xl font-bold text-white">
              {projects.length}
            </p>
          </div>
        </section>

        {/* =====================================
            PROJECTS
        ====================================== */}

        <section className="mt-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
                Portfolio
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Projects
              </h2>

              <p className="mt-2 text-slate-400">
                Manage the projects displayed on your portfolio.
              </p>
            </div>

            <button
              onClick={() => {
                resetProjectForm()
                setShowProjectForm(true)
              }}
              className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-blue-500 hover:text-white"
            >
              + Add Project
            </button>
          </div>

          {/* Project Form */}

          {showProjectForm && (
            <form
              onSubmit={saveProject}
              className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">
                    {editingProjectId
                      ? "Edit Project"
                      : "Add New Project"}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Enter your project details.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetProjectForm}
                  className="text-sm text-slate-500 transition hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Title */}

                <div>
                  <label
                    htmlFor="project-title"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Project Title
                  </label>

                  <input
                    id="project-title"
                    type="text"
                    value={projectTitle}
                    onChange={(event) =>
                      setProjectTitle(
                        event.target.value
                      )
                    }
                    placeholder="My Portfolio Website"
                    required
                    maxLength={200}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                  />
                </div>

                {/* Technologies */}

                <div>
                  <label
                    htmlFor="project-technologies"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Technologies
                  </label>

                  <input
                    id="project-technologies"
                    type="text"
                    value={projectTechnologies}
                    onChange={(event) =>
                      setProjectTechnologies(
                        event.target.value
                      )
                    }
                    placeholder="React, TypeScript, Node.js"
                    required
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                  />
                </div>

                {/* Project Image */}

                <div className="md:col-span-2">
                  <label
                    htmlFor="project-image"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Project Image
                    <span className="ml-2 text-xs text-slate-500">
                      Optional
                    </span>
                  </label>

                  <input
                    id="project-image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={
                      handleProjectImageChange
                    }
                    className="block w-full cursor-pointer rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-md file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950 hover:file:bg-blue-500 hover:file:text-white"
                  />

                  <p className="mt-2 text-xs text-slate-600">
                    JPG, PNG, WEBP or GIF. Maximum size: 5 MB.
                  </p>

                  {/* Selected image */}

                  {projectImage && (
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-medium text-slate-500">
                        Selected image
                      </p>

                      <img
                        src={URL.createObjectURL(
                          projectImage
                        )}
                        alt="Selected project preview"
                        className="h-48 w-full rounded-lg border border-white/10 object-cover"
                      />
                    </div>
                  )}

                  {/* Existing Cloudinary image */}

                  {!projectImage &&
                    editingProjectId &&
                    projectImageUrl && (
                      <div className="mt-4">
                        <p className="mb-2 text-xs font-medium text-slate-500">
                          Current image
                        </p>

                        <img
                          src={projectImageUrl}
                          alt="Current project"
                          className="h-48 w-full rounded-lg border border-white/10 object-cover"
                        />
                      </div>
                    )}
                </div>

                {/* Live URL */}

                <div>
                  <label
                    htmlFor="project-live"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Live Website URL
                    <span className="ml-2 text-xs text-slate-500">
                      Optional
                    </span>
                  </label>

                  <input
                    id="project-live"
                    type="url"
                    value={projectLiveUrl}
                    onChange={(event) =>
                      setProjectLiveUrl(
                        event.target.value
                      )
                    }
                    placeholder="https://example.com"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                  />
                </div>

                {/* GitHub URL */}

                <div>
                  <label
                    htmlFor="project-github"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    GitHub URL
                    <span className="ml-2 text-xs text-slate-500">
                      Optional
                    </span>
                  </label>

                  <input
                    id="project-github"
                    type="url"
                    value={projectGithubUrl}
                    onChange={(event) =>
                      setProjectGithubUrl(
                        event.target.value
                      )
                    }
                    placeholder="https://github.com/username/project"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                  />
                </div>

                {/* Description */}

                <div className="md:col-span-2">
                  <label
                    htmlFor="project-description"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Description
                  </label>

                  <textarea
                    id="project-description"
                    value={projectDescription}
                    onChange={(event) =>
                      setProjectDescription(
                        event.target.value
                      )
                    }
                    placeholder="Describe what this project does..."
                    required
                    maxLength={3000}
                    rows={5}
                    className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                  />
                </div>

                {/* Featured */}

                <div className="md:col-span-2">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={projectFeatured}
                      onChange={(event) =>
                        setProjectFeatured(
                          event.target.checked
                        )
                      }
                      className="h-4 w-4 accent-blue-500"
                    />

                    <span className="text-sm text-slate-300">
                      Mark this project as featured
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSavingProject}
                  className="rounded-lg bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-blue-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSavingProject
                    ? "Uploading & Saving..."
                    : editingProjectId
                    ? "Update Project"
                    : "Create Project"}
                </button>

                <button
                  type="button"
                  onClick={resetProjectForm}
                  className="rounded-lg border border-white/10 px-6 py-3 font-semibold text-slate-300 transition hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Projects List */}

          {isLoadingProjects && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
              Loading projects...
            </div>
          )}

          {!isLoadingProjects &&
            projects.length === 0 && (
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                <p className="text-slate-400">
                  No projects found.
                </p>

                <p className="mt-2 text-sm text-slate-600">
                  Add your first project using the button above.
                </p>
              </div>
            )}

          {!isLoadingProjects &&
            projects.length > 0 && (
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {projects.map((project) => (
                  <article
                    key={project.id}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                  >
                    {project.imageUrl && (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="h-48 w-full object-cover"
                      />
                    )}

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            {project.title}
                          </h3>

                          {project.featured && (
                            <span className="mt-2 inline-block rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400">
                              Featured
                            </span>
                          )}
                        </div>

                        <span className="text-xs text-slate-600">
                          #{project.id}
                        </span>
                      </div>

                      <p className="mt-4 text-sm leading-7 text-slate-400">
                        {project.description}
                      </p>

                      <div className="mt-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                          Technologies
                        </p>

                        <p className="mt-2 text-sm text-slate-300">
                          {project.technologies}
                        </p>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-blue-500 hover:text-white"
                          >
                            Live Website
                          </a>
                        )}

                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                          >
                            GitHub
                          </a>
                        )}
                      </div>

                      <div className="mt-6 flex gap-3 border-t border-white/10 pt-5">
                        <button
                          onClick={() =>
                            startEditProject(
                              project
                            )
                          }
                          className="rounded-lg bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400 transition hover:bg-blue-500/20"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            deleteProject(
                              project.id
                            )
                          }
                          className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
        </section>

        {/* =====================================
            CONTACT MESSAGES
        ====================================== */}

        <section className="mt-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
              Inbox
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Contact Messages
            </h2>

            <p className="mt-2 text-slate-400">
              Messages submitted through your contact form.
            </p>
          </div>

          {isLoadingMessages && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
              Loading messages...
            </div>
          )}

          {!isLoadingMessages &&
            messages.length === 0 && (
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
                No contact messages yet.
              </div>
            )}

          {!isLoadingMessages &&
            messages.length > 0 && (
              <div className="mt-8 space-y-5">
                {messages.map((message) => (
                  <article
                    key={message.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-6"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-semibold text-white">
                          {message.subject}
                        </h3>

                        <p className="mt-1 text-sm text-blue-400">
                          {message.name}
                        </p>

                        {message.phone ? (
                          <a
                            href={`tel:${message.phone}`}
                            className="mt-1 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-blue-400"
                          >
                            <span>📞</span>
                            <span>{message.phone}</span>
                          </a>
                        ) : (
                          <p className="mt-1 text-sm text-slate-600">
                            Phone number not provided
                          </p>
                        )}

                        <a
                          href={`mailto:${message.email}`}
                          className="mt-1 block text-sm text-slate-500 transition hover:text-blue-400"
                        >
                          {message.email}
                        </a>
                      </div>

                      <p className="text-xs text-slate-600">
                        {new Date(
                          message.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>

                    <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-300">
                      {message.message}
                    </p>

                    <div className="mt-5 border-t border-white/10 pt-5">
                      <button
                        onClick={() =>
                          deleteContactMessage(
                            message.id
                          )
                        }
                        className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                      >
                        Delete Message
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
        </section>

        {/* =====================================
            REVIEWS
        ====================================== */}

        <section className="mt-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
              Client Feedback
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Reviews
            </h2>

            <p className="mt-2 text-slate-400">
              Approve, reject, edit, or delete client reviews.
            </p>
          </div>

          {isLoadingReviews && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
              Loading reviews...
            </div>
          )}

          {!isLoadingReviews &&
            reviews.length === 0 && (
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
                No reviews yet.
              </div>
            )}

          {!isLoadingReviews &&
            reviews.length > 0 && (
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                {reviews.map((review) => {
                  const isEditing =
                    editingReviewId ===
                    review.id

                  return (
                    <article
                      key={review.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-6"
                    >
                      {!isEditing ? (
                        <>
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-white">
                                {review.clientName}
                              </h3>

                              {review.clientRole && (
                                <p className="mt-1 text-sm text-slate-500">
                                  {review.clientRole}
                                </p>
                              )}
                            </div>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                review.status ===
                                "APPROVED"
                                  ? "bg-green-500/10 text-green-400"
                                  : review.status ===
                                    "REJECTED"
                                  ? "bg-red-500/10 text-red-400"
                                  : "bg-yellow-500/10 text-yellow-400"
                              }`}
                            >
                              {review.status}
                            </span>
                          </div>

                          <div className="mt-4 flex items-center gap-1 text-yellow-400">
                            {Array.from(
                              { length: 5 },
                              (_, index) => (
                                <span
                                  key={index}
                                  className={
                                    index <
                                    review.rating
                                      ? "text-yellow-400"
                                      : "text-slate-700"
                                  }
                                >
                                  ★
                                </span>
                              )
                            )}
                          </div>

                          <p className="mt-5 text-sm leading-7 text-slate-300">
                            "{review.message}"
                          </p>

                          <p className="mt-4 text-xs text-slate-600">
                            Submitted{" "}
                            {new Date(
                              review.createdAt
                            ).toLocaleString()}
                          </p>

                          <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
                            <button
                              onClick={() =>
                                updateReviewStatus(
                                  review.id,
                                  "APPROVED"
                                )
                              }
                              className="rounded-lg bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400 transition hover:bg-green-500/20"
                            >
                              Approve
                            </button>

                            <button
                              onClick={() =>
                                updateReviewStatus(
                                  review.id,
                                  "REJECTED"
                                )
                              }
                              className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                            >
                              Reject
                            </button>

                            <button
                              onClick={() =>
                                updateReviewStatus(
                                  review.id,
                                  "PENDING"
                                )
                              }
                              className="rounded-lg bg-yellow-500/10 px-4 py-2 text-sm font-medium text-yellow-400 transition hover:bg-yellow-500/20"
                            >
                              Pending
                            </button>

                            <button
                              onClick={() =>
                                startEditReview(
                                  review
                                )
                              }
                              className="rounded-lg bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400 transition hover:bg-blue-500/20"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                deleteReview(
                                  review.id
                                )
                              }
                              className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <h3 className="text-lg font-bold">
                            Edit Review
                          </h3>

                          <div className="mt-6 space-y-5">
                            <div>
                              <label
                                htmlFor={`edit-name-${review.id}`}
                                className="mb-2 block text-sm font-medium text-slate-300"
                              >
                                Client Name
                              </label>

                              <input
                                id={`edit-name-${review.id}`}
                                type="text"
                                value={
                                  editClientName
                                }
                                onChange={(event) =>
                                  setEditClientName(
                                    event.target
                                      .value
                                  )
                                }
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-500"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor={`edit-role-${review.id}`}
                                className="mb-2 block text-sm font-medium text-slate-300"
                              >
                                Client Role
                              </label>

                              <input
                                id={`edit-role-${review.id}`}
                                type="text"
                                value={
                                  editClientRole
                                }
                                onChange={(event) =>
                                  setEditClientRole(
                                    event.target
                                      .value
                                  )
                                }
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-500"
                              />
                            </div>

                            <div>
                              <p className="mb-2 text-sm font-medium text-slate-300">
                                Rating
                              </p>

                              <div className="flex gap-1">
                                {Array.from(
                                  { length: 5 },
                                  (_, index) => {
                                    const star =
                                      index + 1

                                    return (
                                      <button
                                        key={star}
                                        type="button"
                                        onClick={() =>
                                          setEditRating(
                                            star
                                          )
                                        }
                                        className={`text-3xl ${
                                          star <=
                                          editRating
                                            ? "text-yellow-400"
                                            : "text-slate-700"
                                        }`}
                                      >
                                        ★
                                      </button>
                                    )
                                  }
                                )}
                              </div>
                            </div>

                            <div>
                              <label
                                htmlFor={`edit-message-${review.id}`}
                                className="mb-2 block text-sm font-medium text-slate-300"
                              >
                                Review Message
                              </label>

                              <textarea
                                id={`edit-message-${review.id}`}
                                value={
                                  editMessage
                                }
                                onChange={(event) =>
                                  setEditMessage(
                                    event.target
                                      .value
                                  )
                                }
                                rows={5}
                                className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-500"
                              />
                            </div>
                          </div>

                          <div className="mt-6 flex gap-3">
                            <button
                              onClick={() =>
                                saveReview(
                                  review.id
                                )
                              }
                              className="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-blue-500 hover:text-white"
                            >
                              Save Changes
                            </button>

                            <button
                              onClick={
                                cancelEditReview
                              }
                              className="rounded-lg border border-white/10 px-5 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      )}
                    </article>
                  )
                })}
              </div>
            )}
        </section>
      </main>
    </div>
  )
}

export default AdminDashboard