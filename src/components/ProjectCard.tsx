import { motion } from "motion/react"

type ProjectCardProps = {
  title: string
  description: string
  technologies: string[]
  githubUrl: string | null
  liveUrl: string | null
  imageUrl: string | null
  featured?: boolean
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

function ProjectCard({
  title,
  description,
  technologies,
  githubUrl,
  liveUrl,
  imageUrl,
  featured = false,
}: ProjectCardProps) {
  return (
    <motion.article
      variants={cardVariants}
      whileHover={{
        y: -8,
      }}
      whileTap={{
        scale: 0.99,
      }}
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 20,
      }}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-colors duration-300 hover:border-blue-500/40 hover:bg-white/[0.07]"
    >
      {/* Project Preview */}
      <div className="relative aspect-video overflow-hidden bg-slate-900">
        {imageUrl ? (
          <motion.img
            src={imageUrl}
            alt={title}
            loading="lazy"
            whileHover={{
              scale: 1.06,
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-sm font-medium text-slate-500">
              Project Preview
            </span>
          </div>
        )}

        {/* Image Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to- from-slate-950/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Featured Badge */}
        {featured && (
          <motion.span
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            className="absolute left-4 top-4 rounded-full border border-blue-400/20 bg-slate-950/80 px-3 py-1 text-xs font-medium text-blue-400 backdrop-blur-sm"
          >
            Featured
          </motion.span>
        )}
      </div>

      {/* Project Content */}
      <div className="p-5 sm:p-6">

        {/* Title */}
        <h3 className="text-xl font-bold text-white sm:text-2xl">
          {title}
        </h3>

        {/* Description */}
        <p className="mt-3 leading-7 text-slate-400">
          {description}
        </p>

        {/* Technologies */}
        {technologies.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {technologies.map((technology, index) => (
              <motion.span
                key={technology}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                }}
                whileHover={{
                  y: -2,
                }}
                className="rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300 transition-colors duration-200 hover:bg-slate-800 hover:text-white"
              >
                {technology}
              </motion.span>
            ))}
          </div>
        )}

        {/* Links */}
        {(githubUrl || liveUrl) && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {githubUrl && (
              <motion.a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{
                  x: 3,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition-colors hover:border-blue-500/40 hover:text-white"
              >
                GitHub →
              </motion.a>
            )}

            {liveUrl && (
              <motion.a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{
                  x: 3,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-blue-500 hover:text-white"
              >
                Live Demo →
              </motion.a>
            )}
          </div>
        )}
      </div>
    </motion.article>
  )
}

export default ProjectCard