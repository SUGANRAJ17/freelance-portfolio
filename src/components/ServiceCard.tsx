import { motion } from "motion/react"

type ServiceCardProps = {
  number: string
  title: string
  description: string
  technologies: string[]
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

function ServiceCard({
  number,
  title,
  description,
  technologies,
}: ServiceCardProps) {
  return (
    <motion.article
      variants={cardVariants}
      whileHover={{
        y: -8,
        scale: 1.01,
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 20,
      }}
      className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors duration-300 hover:border-blue-500/40 hover:bg-white/[0.07] sm:p-6"
    >
      {/* Card Top */}
      <div className="flex items-center justify-between">
        <motion.span
          className="text-sm font-semibold text-blue-500"
          whileHover={{
            scale: 1.1,
          }}
        >
          {number}
        </motion.span>

        <motion.span
          className="text-xl text-slate-500"
          initial={{
            x: 0,
            y: 0,
          }}
          whileHover={{
            x: 4,
            y: -4,
            color: "#ffffff",
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 18,
          }}
        >
          ↗
        </motion.span>
      </div>

      {/* Title */}
      <h3 className="mt-6 text-xl font-bold text-white sm:mt-8 sm:text-2xl">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-3 leading-7 text-slate-400 sm:mt-4">
        {description}
      </p>

      {/* Technologies */}
      <div className="mt-5 flex flex-wrap gap-2 sm:mt-6">
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
              delay: index * 0.08,
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
    </motion.article>
  )
}

export default ServiceCard