import { motion } from "motion/react"

const quickLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Reviews", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
]

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/SUGANRAJ17",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/sugan-raj-5147a4296/",
  },
]

function Footer() {
  const currentYear = new Date().getFullYear()

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">

        {/* Main Footer */}
        <motion.div
          className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]"
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.6,
          }}
        >

          {/* Brand */}
          <div className="max-w-sm">
            <motion.a
              href="#"
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              className="inline-block text-2xl font-bold text-white"
            >
              Sugan<span className="text-blue-500">.</span>
            </motion.a>

            <p className="mt-4 leading-7 text-slate-400">
              Full-stack developer and freelancer building
              modern, responsive and reliable web applications.
            </p>

            {/* CTA */}
            <motion.a
              href="#contact"
              whileHover={{
                y: -2,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="mt-6 inline-flex items-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-blue-500 hover:text-white"
            >
              Start a Project
              <span className="ml-2">
                →
              </span>
            </motion.a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white">
              Quick Links
            </h3>

            <motion.div
              className="mt-4 flex flex-col gap-3"
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
              }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
            >
              {quickLinks.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  variants={{
                    hidden: {
                      opacity: 0,
                      x: -10,
                    },
                    visible: {
                      opacity: 1,
                      x: 0,
                    },
                  }}
                  whileHover={{
                    x: 4,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                  }}
                  className="w-fit text-slate-400 transition-colors hover:text-white"
                >
                  {link.label}
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold text-white">
              Connect
            </h3>

            <motion.div
              className="mt-4 flex flex-col gap-3"
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
              }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.08,
                  },
                },
              }}
            >
              {socialLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={{
                    hidden: {
                      opacity: 0,
                      x: -10,
                    },
                    visible: {
                      opacity: 1,
                      x: 0,
                    },
                  }}
                  whileHover={{
                    x: 4,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                  }}
                  className="w-fit text-slate-400 transition-colors hover:text-white"
                >
                  {link.label} ↗
                </motion.a>
              ))}

              <motion.a
                href="mailto:suganraj0028@email.com"
                whileHover={{
                  x: 4,
                }}
                className="w-fit text-slate-400 transition-colors hover:text-white"
              >
                Email ↗
              </motion.a>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom */}
        <motion.div
          className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between"
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
            delay: 0.2,
          }}
        >
          <p>
            © {currentYear} Sugan Raj. All rights reserved.
          </p>

          <motion.button
            type="button"
            onClick={scrollToTop}
            whileHover={{
              y: -2,
            }}
            whileTap={{
              scale: 0.97,
            }}
            className="w-fit transition-colors hover:text-white"
          >
            Back to top ↑
          </motion.button>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer