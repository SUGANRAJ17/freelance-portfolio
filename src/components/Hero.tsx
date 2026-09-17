import { motion } from "motion/react"

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <div className="max-w-4xl">

          {/* Availability */}
          <motion.div
            className="mb-6 flex items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.1,
            }}
          >
            <span className="h-3 w-3 rounded-full bg-green-500" />

            <span className="text-sm font-medium text-slate-400">
              Available for freelance work
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-7xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.2,
            }}
          >
            Hi, I'm{" "}

            <span className="text-blue-500">
              Sugan Raj
            </span>

            <br />

            Full-Stack Developer
            <br />

            & Freelancer
          </motion.h1>

          {/* Description */}
          <motion.p
            className="mt-8 max-w-2xl text-lg leading-8 text-slate-400"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.4,
            }}
          >
            I build modern, responsive and scalable web applications
            that turn ideas into reliable digital products.
          </motion.p>

          {/* Buttons */}
          <motion.div
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.6,
            }}
          >
            {/* View My Work */}
            <motion.a
              href="#projects"
              whileHover={{
                scale: 1.04,
                y: -2,
              }}
              whileTap={{
                scale: 0.97,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
              }}
              className="rounded-lg bg-white px-6 py-3 text-center font-semibold text-slate-950"
            >
              View My Work
            </motion.a>

            {/* Let's Work Together */}
            <motion.a
              href="#contact"
              whileHover={{
                scale: 1.04,
                y: -2,
              }}
              whileTap={{
                scale: 0.97,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
              }}
              className="rounded-lg border border-white/20 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-white/10"
            >
              Let's Work Together
            </motion.a>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default Hero