import { useEffect, useMemo, useState } from "react"
import { motion } from "motion/react"
import ProjectCard from "./ProjectCard"
import { getProjects } from "../services/api"
import type { Project } from "../types"


interface Project {
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

function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const [searchTerm, setSearchTerm] = useState("")
  const [showFeaturedOnly, setShowFeaturedOnly] =
    useState(false)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getProjects()

        setProjects(data.projects as Project[])
      } catch (error) {
        console.error("Fetch projects error:", error)

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load projects"
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const filteredProjects = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase()

    return projects.filter((project) => {
      const matchesSearch =
        !normalizedSearch ||
        project.title
          .toLowerCase()
          .includes(normalizedSearch) ||
        project.description
          .toLowerCase()
          .includes(normalizedSearch) ||
        project.technologies
          .toLowerCase()
          .includes(normalizedSearch)

      const matchesFeatured =
        !showFeaturedOnly || project.featured

      return matchesSearch && matchesFeatured
    })
  }, [projects, searchTerm, showFeaturedOnly])

  return (
    <section
      id="projects"
      className="border-t border-white/10 bg-slate-950 px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Header */}
        <motion.div
          className="max-w-2xl"
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.6,
          }}
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
            Projects
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Selected work
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-400">
            A selection of projects I have designed and
            developed.
          </p>
        </motion.div>

        {/* Search & Filter */}
        {!isLoading &&
          !error &&
          projects.length > 0 && (
            <motion.div
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.5,
                delay: 0.1,
              }}
            >
              {/* Search */}
              <div className="relative w-full sm:max-w-md">
                <span
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  aria-hidden="true"
                >
                  ⌕
                </span>

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search projects..."
                  aria-label="Search projects"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-white/[0.07]"
                />
              </div>

              {/* Featured Filter */}
              <motion.button
                type="button"
                onClick={() =>
                  setShowFeaturedOnly(
                    !showFeaturedOnly
                  )
                }
                whileTap={{
                  scale: 0.97,
                }}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                  showFeaturedOnly
                    ? "border-blue-500/40 bg-blue-500/10 text-blue-400"
                    : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white"
                }`}
              >
                {showFeaturedOnly
                  ? "Showing Featured"
                  : "Featured Only"}
              </motion.button>
            </motion.div>
          )}

        {/* Loading */}
        {isLoading && (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                >
                  <div className="aspect-video animate-pulse bg-white/10" />

                  <div className="space-y-4 p-6">
                    <div className="h-6 w-2/3 animate-pulse rounded bg-white/10" />

                    <div className="h-4 w-full animate-pulse rounded bg-white/10" />

                    <div className="h-4 w-5/6 animate-pulse rounded bg-white/10" />

                    <div className="flex gap-2">
                      <div className="h-6 w-16 animate-pulse rounded bg-white/10" />
                      <div className="h-6 w-20 animate-pulse rounded bg-white/10" />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <motion.div
            className="mt-12 rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <p className="text-red-400">
              Unable to load projects right now.
            </p>
          </motion.div>
        )}

        {/* No Projects */}
        {!isLoading &&
          !error &&
          projects.length === 0 && (
            <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-slate-400">
                No projects available yet.
              </p>
            </div>
          )}

        {/* Filtered Empty State */}
        {!isLoading &&
          !error &&
          projects.length > 0 &&
          filteredProjects.length === 0 && (
            <motion.div
              className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-10 text-center"
              initial={{
                opacity: 0,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
            >
              <p className="text-lg font-semibold text-white">
                No matching projects
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Try a different search term or remove
                the featured filter.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchTerm("")
                  setShowFeaturedOnly(false)
                }}
                className="mt-5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-200"
              >
                Clear Filters
              </button>
            </motion.div>
          )}

        {/* Projects */}
        {!isLoading &&
          !error &&
          filteredProjects.length > 0 && (
            <motion.div
              className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.1,
              }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.12,
                  },
                },
              }}
            >
              {filteredProjects.map((project) => {
                const technologies =
                  project.technologies
                    .split(",")
                    .map((technology) =>
                      technology.trim()
                    )
                    .filter(Boolean)

                return (
                  <ProjectCard
                    key={project.id}
                    title={project.title}
                    description={project.description}
                    technologies={technologies}
                    githubUrl={project.githubUrl}
                    liveUrl={project.liveUrl}
                    imageUrl={project.imageUrl}
                    featured={project.featured}
                  />
                )
              })}
            </motion.div>
          )}
      </div>
    </section>
  )
}

export default Projects