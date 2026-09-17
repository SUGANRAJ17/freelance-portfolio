import { motion } from "motion/react"

const skills = [
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "Express",
  "PostgreSQL",
]

const paragraphVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
}

const skillContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
}

const skillVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.35,
    },
  },
}

function About() {
  return (
    <section
      id="about"
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
            About Me
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            I build digital products with purpose.
          </h2>
        </motion.div>

        {/* Content */}
        <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-2 lg:gap-12">

          {/* About Text */}
          <motion.div
            className="space-y-6 text-lg leading-8 text-slate-400"
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              staggerChildren: 0.15,
            }}
          >
            <motion.p variants={paragraphVariants}>
              I'm a developer focused on building modern web
              applications that are fast, responsive and easy to use.
            </motion.p>

            <motion.p variants={paragraphVariants}>
              I enjoy turning ideas into practical digital
              experiences, from simple websites to full-stack
              applications.
            </motion.p>

            <motion.p variants={paragraphVariants}>
              My goal is to create software that not only looks
              good, but also solves real problems for real users.
            </motion.p>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            <h3 className="text-xl font-semibold text-white">
              Technologies I Work With
            </h3>

            <motion.div
              className="mt-6 flex flex-wrap gap-3"
              variants={skillContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.2,
              }}
            >
              {skills.map((skill) => (
                <motion.span
                  key={skill}
                  variants={skillVariants}
                  whileHover={{
                    scale: 1.06,
                    y: -3,
                  }}
                  whileTap={{
                    scale: 0.96,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                  }}
                  className="cursor-default rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-blue-500/50 hover:bg-blue-500/5 hover:text-white"
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

        </div>

      </div>
    </section>
  )
}

export default About