import { motion } from "motion/react"

type ExperienceItem = {
  year: string
  role: string
  company: string
  description: string
  technologies: string[]
}

const experiences: ExperienceItem[] = [
  {
    year: "2026",
    role: "Full-Stack Developer",
    company: "Freelance",
    description:
      "Building modern web applications and digital products for real-world use cases.",
    technologies: ["React", "TypeScript", "Node.js"],
  },
  {
    year: "2025",
    role: "Frontend Developer",
    company: "Personal Projects",
    description:
      "Developed responsive interfaces and interactive web applications while strengthening frontend development skills.",
    technologies: ["React", "JavaScript", "Tailwind CSS"],
  },
  {
    year: "2024",
    role: "Started Web Development",
    company: "Self Learning",
    description:
      "Started learning the fundamentals of web development and built my first websites and JavaScript applications.",
    technologies: ["HTML", "CSS", "JavaScript"],
  },
]

const itemVariants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
}

const technologyVariants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
    y: 8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
}

function Experience() {
  return (
    <section
      id="experience"
      className="border-t border-white/10"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">

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
            Experience
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            My Journey
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-400">
            My journey from learning web development to building
            modern full-stack applications.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative mt-12 sm:mt-16">

          {/* Timeline Background Line */}
          <div className="absolute left -[7px] top-2 h-[calc(100%-8px)] w-px bg-white/10" />

          {/* Animated Timeline Line */}
          <motion.div
            className="absolute left -[7px] top-2 w-px origin-top bg-blue-500"
            initial={{
              scaleY: 0,
            }}
            whileInView={{
              scaleY: 1,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 1.5,
              ease: "easeOut",
            }}
            style={{
              height: "calc(100% - 8px)",
            }}
          />

          <div className="space-y-8 sm:space-y-10">

            {experiences.map((experience, index) => (
              <motion.div
                key={`${experience.year}-${experience.role}`}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  delay: index * 0.15,
                }}
                className="relative pl-8 sm:pl-12"
              >

                {/* Timeline Dot */}
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0,
                  }}
                  whileInView={{
                    opacity: 1,
                    scale: 1,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.4,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.15 + 0.15,
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                  }}
                  className="absolute left-0 top-7 z-10 flex h-4 w-4 items-center justify-center rounded-full border-4 border-slate-950 bg-blue-500"
                />

                {/* Experience Card */}
                <motion.article
                  whileHover={{
                    y: -5,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 20,
                  }}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors duration-300 hover:border-blue-500/30 hover:bg-white/[0.07] sm:p-6"
                >

                  {/* Top Row */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                    {/* Year */}
                    <motion.p
                      className="text-sm font-semibold text-blue-500"
                      whileHover={{
                        x: 3,
                      }}
                    >
                      {experience.year}
                    </motion.p>

                    {/* Experience Number */}
                    <span className="hidden text-xs font-medium tracking-widest text-slate-700 sm:block">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Role */}
                  <h3 className="mt-3 text-xl font-bold text-white sm:text-2xl">
                    {experience.role}
                  </h3>

                  {/* Company */}
                  <p className="mt-1 font-medium text-slate-300">
                    {experience.company}
                  </p>

                  {/* Description */}
                  <p className="mt-4 max-w-3xl leading-7 text-slate-400">
                    {experience.description}
                  </p>

                  {/* Technologies */}
                  <motion.div
                    className="mt-5 flex flex-wrap gap-2"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                      once: true,
                      amount: 0.2,
                    }}
                    variants={{
                      hidden: {},
                      visible: {
                        transition: {
                          staggerChildren: 0.08,
                          delayChildren: index * 0.15 + 0.2,
                        },
                      },
                    }}
                  >
                    {experience.technologies.map(
                      (technology) => (
                        <motion.span
                          key={technology}
                          variants={technologyVariants}
                          whileHover={{
                            y: -2,
                            scale: 1.04,
                          }}
                          className="rounded-md border border-white/10 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300 transition-colors duration-200 hover:border-blue-500/30 hover:text-white"
                        >
                          {technology}
                        </motion.span>
                      )
                    )}
                  </motion.div>
                </motion.article>
              </motion.div>
            ))}

          </div>
        </div>

      </div>
    </section>
  )
}

export default Experience