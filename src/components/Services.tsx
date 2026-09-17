import { motion } from "motion/react"
import ServiceCard from "./ServiceCard"

const services = [
  {
    number: "01",
    title: "Web Development",
    description:
      "Modern, responsive websites designed to give your business a professional online presence.",
    technologies: ["HTML", "CSS", "JavaScript"],
  },
  {
    number: "02",
    title: "Frontend Development",
    description:
      "Interactive and responsive user interfaces built with modern React development practices.",
    technologies: ["React", "TypeScript", "Tailwind CSS"],
  },
  {
    number: "03",
    title: "Full-Stack Development",
    description:
      "Complete web applications with frontend interfaces, backend APIs and database integration.",
    technologies: ["React", "Node.js", "Express"],
  },
]

function Services() {
  return (
    <section
      id="services"
      className="border-t border-white/10"
    >
      <div className="mx-auto max-w-7xl px-6 py-24">

        {/* Header */}
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
            Services
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            What I Can Build For You
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-400">
            From simple websites to complete full-stack applications,
            I focus on building reliable digital experiences.
          </p>
        </motion.div>

        {/* Services */}
        <motion.div
          className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          {services.map((service) => (
            <ServiceCard
              key={service.number}
              number={service.number}
              title={service.title}
              description={service.description}
              technologies={service.technologies}
            />
          ))}
        </motion.div>

      </div>
    </section>
  )
}

export default Services