import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"

const navItems = [
  {
    label: "About",
    href: "#about",
  },
  {
    label: "Services",
    href: "#services",
  },
  {
    label: "Projects",
    href: "#projects",
  },
  {
    label: "Experience",
    href: "#experience",
  },
  {
    label: "Reviews",
    href: "#testimonials",
  },
]

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  function closeMenu() {
    setIsMenuOpen(false)
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-md"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-20 items-center justify-between">

          {/* Logo */}
          <motion.a
            href="#"
            onClick={closeMenu}
            whileHover={{
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.97,
            }}
            className="text-2xl font-bold text-white"
          >
            Sugan
            <span className="text-blue-500">.</span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">

            {navItems.map((item) => (
              <motion.a
                key={item.href}
                href={item.href}
                whileHover={{
                  y: -2,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                }}
                className="group relative text-slate-300 transition-colors hover:text-white"
              >
                {item.label}

                {/* Animated underline */}
                <span
                  className="
                    absolute
                    -bottom-2
                    left-0
                    h-0.5
                    w-0
                    rounded-full
                    bg-blue-500
                    transition-all
                    duration-300
                    group-hover:w-full
                  "
                />
              </motion.a>
            ))}

            {/* Contact Button */}
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
              className="rounded-lg bg-white px-5 py-2.5 font-semibold text-slate-950 transition-colors hover:bg-blue-500 hover:text-white"
            >
              Contact
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{
              scale: 0.9,
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white transition-colors hover:border-white/20 hover:bg-white/5 md:hidden"
            aria-label={
              isMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMenuOpen ? (
                <motion.span
                  key="close"
                  initial={{
                    opacity: 0,
                    rotate: -90,
                    scale: 0.5,
                  }}
                  animate={{
                    opacity: 1,
                    rotate: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    rotate: 90,
                    scale: 0.5,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="absolute text-xl"
                >
                  ✕
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{
                    opacity: 0,
                    rotate: 90,
                    scale: 0.5,
                  }}
                  animate={{
                    opacity: 1,
                    rotate: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    rotate: -90,
                    scale: 0.5,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="absolute text-xl"
                >
                  ☰
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="mobile-navigation"
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className="overflow-hidden border-t border-white/10 md:hidden"
            >
              <motion.div
                initial={{
                  opacity: 0,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.3,
                  delay: 0.1,
                }}
                className="flex flex-col gap-2 py-5"
              >

                {navItems.map((item, index) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    initial={{
                      opacity: 0,
                      x: -15,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      duration: 0.3,
                      delay: 0.05 * index,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    className="rounded-lg px-3 py-3 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {item.label}
                  </motion.a>
                ))}

                {/* Mobile Contact */}
                <motion.a
                  href="#contact"
                  onClick={closeMenu}
                  initial={{
                    opacity: 0,
                    x: -15,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 0.3,
                    delay: 0.3,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="mt-2 rounded-lg bg-white px-5 py-3 text-center font-semibold text-slate-950 transition-colors hover:bg-blue-500 hover:text-white"
                >
                  Contact
                </motion.a>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar