import { useState } from "react"
import type {
  ChangeEvent,
  FormEvent,
} from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"

import { submitReview } from "../services/api"

function ReviewPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    clientName: "",
    clientRole: "",
    rating: 5,
    message: "",
  })

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const [submitted, setSubmitted] =
    useState(false)

  const [error, setError] =
    useState("")

  function handleChange(
    e: ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) {
    const {
      name,
      value,
    } = e.target

    setFormData((prev) => ({
      ...prev,

      [name]:
        name === "rating"
          ? Number(value)
          : value,
    }))
  }

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    setError("")
    setSubmitted(false)
    setIsSubmitting(true)

    try {
      await submitReview(formData)

      setSubmitted(true)

      setFormData({
        clientName: "",
        clientRole: "",
        rating: 5,
        message: "",
      })

      setTimeout(() => {
        navigate("/", {
          replace: true,
        })
      }, 2000)
    } catch (error) {
      console.error(
        "Submit review error:",
        error
      )

      setError(
        error instanceof Error
          ? error.message
          : "Unable to submit review"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-2xl">

        {/* ==================================================
            HEADER
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="mb-10 text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Client Feedback
          </p>

          <h1 className="text-4xl font-bold sm:text-5xl">
            Leave a Review
          </h1>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">
            Share your experience working with me.
            Your feedback helps improve my work and helps
            future clients make confident decisions.
          </p>
        </motion.div>

        {/* ==================================================
            FORM
        ================================================== */}

        <motion.form
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.1,
          }}
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl sm:p-8"
        >

          {/* ==================================================
              CLIENT NAME
          ================================================== */}

          <div>
            <label
              htmlFor="clientName"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Your Name
            </label>

            <input
              id="clientName"
              name="clientName"
              type="text"
              value={formData.clientName}
              onChange={handleChange}
              required
              maxLength={100}
              placeholder="Enter your name"
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />
          </div>

          {/* ==================================================
              CLIENT ROLE
          ================================================== */}

          <div className="mt-5">
            <label
              htmlFor="clientRole"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Role / Company
            </label>

            <input
              id="clientRole"
              name="clientRole"
              type="text"
              value={formData.clientRole}
              onChange={handleChange}
              maxLength={100}
              placeholder="e.g. Founder, Business Owner"
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />
          </div>

          {/* ==================================================
              RATING
          ================================================== */}

          <div className="mt-5">
            <label
              htmlFor="rating"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Rating
            </label>

            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            >
              <option value={5}>
                ★★★★★ — Excellent
              </option>

              <option value={4}>
                ★★★★☆ — Very Good
              </option>

              <option value={3}>
                ★★★☆☆ — Good
              </option>

              <option value={2}>
                ★★☆☆☆ — Fair
              </option>

              <option value={1}>
                ★☆☆☆☆ — Poor
              </option>
            </select>
          </div>

          {/* ==================================================
              MESSAGE
          ================================================== */}

          <div className="mt-5">
            <label
              htmlFor="message"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Your Review
            </label>

            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              maxLength={1000}
              rows={6}
              placeholder="Write your experience..."
              className="w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />

            <div className="mt-2 text-right text-xs text-slate-500">
              {formData.message.length}/1000
            </div>
          </div>

          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* ==================================================
              SUCCESS
          ================================================== */}

          {submitted && (
            <div className="mt-5 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              Thank you! Your review has been submitted.
              Redirecting to the portfolio...
            </div>
          )}

          {/* ==================================================
              SUBMIT BUTTON
          ================================================== */}

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{
              y: -2,
            }}
            whileTap={{
              scale: 0.98,
            }}
            className="mt-6 flex w-full items-center justify-center rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-blue-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Submitting..."
              : "Submit Review →"}
          </motion.button>

          {/* ==================================================
              BACK BUTTON
          ================================================== */}

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-4 w-full text-center text-sm text-slate-500 transition hover:text-white"
          >
            ← Back to Portfolio
          </button>

        </motion.form>
      </div>
    </main>
  )
}

export default ReviewPage