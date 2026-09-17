import { useEffect, useState } from "react"
import { motion } from "motion/react"
import type { Variants } from "motion/react"

import { getReviews } from "../services/api"
import type { Review } from "../types"

/* ======================================================
   ANIMATION VARIANTS
====================================================== */

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 35,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

const reviewGridVariants: Variants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

/* ======================================================
   COMPONENT
====================================================== */

function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  /* ====================================================
     FETCH REVIEWS
  ==================================================== */

  useEffect(() => {
    async function fetchReviews() {
      try {
        const data = await getReviews()

        setReviews(data.reviews)
      } catch (error) {
        console.error(
          "Fetch reviews error:",
          error
        )

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load reviews"
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviews()
  }, [])

  /* ====================================================
     RENDER
  ==================================================== */

  return (
    <section
      id="testimonials"
      className="border-t border-white/10 bg-slate-950 px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">

        {/* ==================================================
            SECTION HEADER
        ================================================== */}

        <motion.div
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
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
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
              Reviews
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              What clients say
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-400">
              Feedback from clients I have worked with.
            </p>
          </div>

          {/* Leave Review */}
          <motion.a
            href="/review"
            whileHover={{
              y: -2,
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.97,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 20,
            }}
            className="inline-flex w-fit items-center rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-blue-500/40 hover:bg-blue-500/10"
          >
            Leave a Review

            <span className="ml-2 text-blue-500">
              →
            </span>
          </motion.a>
        </motion.div>

        {/* ==================================================
            LOADING STATE
        ================================================== */}

        {isLoading && (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  {/* Stars */}
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map(
                      (_, starIndex) => (
                        <div
                          key={starIndex}
                          className="h-5 w-5 animate-pulse rounded bg-white/10"
                        />
                      )
                    )}
                  </div>

                  {/* Message */}
                  <div className="mt-6 space-y-3">
                    <div className="h-4 w-full animate-pulse rounded bg-white/10" />

                    <div className="h-4 w-5/6 animate-pulse rounded bg-white/10" />

                    <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
                  </div>

                  {/* Client */}
                  <div className="mt-7 border-t border-white/10 pt-5">
                    <div className="h-4 w-32 animate-pulse rounded bg-white/10" />

                    <div className="mt-2 h-3 w-24 animate-pulse rounded bg-white/10" />
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* ==================================================
            ERROR STATE
        ================================================== */}

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
            <p className="text-sm font-medium text-red-400">
              Unable to load reviews right now.
            </p>

            <p className="mt-2 text-xs text-red-400/70">
              Please try again later.
            </p>
          </motion.div>
        )}

        {/* ==================================================
            EMPTY STATE
        ================================================== */}

        {!isLoading &&
          !error &&
          reviews.length === 0 && (
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
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl text-slate-500">
                ★
              </div>

              <p className="mt-5 text-lg font-semibold text-white">
                No client reviews yet
              </p>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Be the first client to share your experience.
              </p>

              <motion.a
                href="/review"
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="mt-6 inline-flex rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-blue-500 hover:text-white"
              >
                Write a Review
              </motion.a>
            </motion.div>
          )}

        {/* ==================================================
            REVIEWS
        ================================================== */}

        {!isLoading &&
          !error &&
          reviews.length > 0 && (
            <motion.div
              className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.1,
              }}
              variants={reviewGridVariants}
            >
              {reviews.map((review) => (
                <motion.article
                  key={review.id}
                  variants={cardVariants}
                  whileHover={{
                    y: -7,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 20,
                  }}
                  className="group relative flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors duration-300 hover:border-blue-500/30 hover:bg-white/[0.07]"
                >
                  {/* Decorative Quote */}
                  <div
                    className="pointer-events-none absolute right-5 top-3 text-6xl font-serif leading-none text-white/[0.04]"
                    aria-hidden="true"
                  >
                    "
                  </div>

                  {/* Rating */}
                  <div
                    className="flex items-center gap-1"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {Array.from(
                      { length: 5 },
                      (_, index) => {
                        const star = index + 1

                        return (
                          <motion.span
                            key={star}
                            initial={{
                              opacity: 0,
                              scale: 0.5,
                            }}
                            whileInView={{
                              opacity: 1,
                              scale: 1,
                            }}
                            viewport={{
                              once: true,
                            }}
                            transition={{
                              duration: 0.25,
                              delay: index * 0.06,
                            }}
                            className={
                              star <= review.rating
                                ? "text-lg text-yellow-400"
                                : "text-lg text-slate-700"
                            }
                          >
                            ★
                          </motion.span>
                        )
                      }
                    )}
                  </div>

                  {/* Review Message */}
                  <p className="mt-5 flex-1 text-sm leading-7 text-slate-300">
                    &quot;{review.message}&quot;
                  </p>

                  {/* Client */}
                  <div className="mt-7 border-t border-white/10 pt-5">
                    <div className="flex items-center gap-3">

                      {/* Avatar */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-sm font-bold uppercase text-blue-400">
                        {review.clientName
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      {/* Client Details */}
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white">
                          {review.clientName}
                        </p>

                        {review.clientRole && (
                          <p className="mt-1 truncate text-sm text-slate-500">
                            {review.clientRole}
                          </p>
                        )}
                      </div>

                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}

      </div>
    </section>
  )
}

export default Testimonials