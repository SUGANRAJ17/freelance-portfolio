import { useState } from "react"
import type { FormEvent } from "react"
import { AnimatePresence, motion } from "motion/react"

import { submitContactMessage } from "../services/api"

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [phoneError, setPhoneError] = useState("")

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setError("")
    setSubmitted(false)

    if (name === "email") {
      setEmailError("")
    }

    if (name === "phone") {
      setPhoneError("")
    }
  }

  function validateGmail(email: string) {
    const gmailRegex =
      /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]{0,62}[a-zA-Z0-9])?@gmail\.com$/

    return gmailRegex.test(email)
  }

  function validatePhone(phone: string) {
    return /^[0-9]{10}$/.test(phone)
  }

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    setError("")
    setSubmitted(false)
    setEmailError("")
    setPhoneError("")

    // Phone validation
    if (!validatePhone(formData.phone)) {
      setPhoneError(
        "Please enter a valid 10-digit phone number."
      )
      return
    }

    // Gmail validation
    if (!validateGmail(formData.email)) {
      setEmailError(
        "Please enter a valid Gmail address, for example: example@gmail.com"
      )
      return
    }

    setIsSubmitting(true)

    try {
      await submitContactMessage(formData)

      setSubmitted(true)

      setFormData({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      console.error(
        "Submit contact message error:",
        error
      )

      setError(
        error instanceof Error
          ? error.message
          : "Unable to send your message"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="contact"
      className="border-t border-white/10 bg-slate-950 px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Contact
          </p>

          <h2 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
            Let&apos;s Work Together
          </h2>

          <p className="mt-5 leading-7 text-slate-400">
            Have a project in mind? Send me a message and
            let&apos;s discuss how I can help bring your idea
            to life.
          </p>
        </motion.div>

        {/* Contact Content */}
        <div className="mt-14 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Left Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-400">
              Start a conversation
            </p>

            <h3 className="mt-3 text-2xl font-bold text-white">
              Tell me about your project
            </h3>

            <p className="mt-4 leading-7 text-slate-400">
              Whether you need a portfolio website, business
              website, web application, or a complete
              full-stack solution, I&apos;d be happy to hear
              about it.
            </p>

            <div className="mt-8 space-y-5">
              {/* Email */}
              <div>
                <p className="text-sm text-slate-500">
                  Email
                </p>

                <a
                  href="mailto:suganraj0028@gmail.com"
                  className="mt-1 inline-block text-slate-200 transition hover:text-blue-400"
                >
                  suganraj0028@gmail.com
                </a>
              </div>

              {/* Phone */}
              <div>
                <p className="text-sm text-slate-500">
                  Phone
                </p>

                <a
                  href="tel:9080922296"
                  className="mt-1 inline-flex items-center gap-2 text-slate-200 transition hover:text-blue-400"
                >
                  <span>📞</span>
                  <span>9080922296</span>
                </a>
              </div>

              {/* Availability */}
              <div>
                <p className="text-sm text-slate-500">
                  Availability
                </p>

                <p className="mt-1 text-slate-200">
                  Available for freelance projects
                </p>
              </div>

              {/* Response Time */}
              <div>
                <p className="text-sm text-slate-500">
                  Response Time
                </p>

                <p className="mt-1 text-slate-200">
                  Usually within 24 hours
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8"
          >
            {/* Name + Phone */}
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10)

                    setFormData((prev) => ({
                      ...prev,
                      phone: value,
                    }))

                    setPhoneError("")
                    setError("")
                    setSubmitted(false)
                  }}
                  onBlur={() => {
                    if (
                      formData.phone &&
                      !validatePhone(formData.phone)
                    ) {
                      setPhoneError(
                        "Please enter a valid 10-digit phone number."
                      )
                    }
                  }}
                  required
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="9876543210"
                  className={`w-full rounded-xl border bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 ${
                    phoneError
                      ? "border-red-500 focus:border-red-500"
                      : "border-white/10 focus:border-blue-500"
                  }`}
                />

                {phoneError && (
                  <p className="mt-2 text-sm text-red-400">
                    {phoneError}
                  </p>
                )}
              </div>
            </div>

            {/* Gmail + Subject */}
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {/* Gmail */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Gmail Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => {
                    if (
                      formData.email &&
                      !validateGmail(formData.email)
                    ) {
                      setEmailError(
                        "Please enter a valid Gmail address, for example: example@gmail.com"
                      )
                    }
                  }}
                  required
                  maxLength={150}
                  placeholder="example@gmail.com"
                  className={`w-full rounded-xl border bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 ${
                    emailError
                      ? "border-red-500 focus:border-red-500"
                      : "border-white/10 focus:border-blue-500"
                  }`}
                />

                {emailError && (
                  <p className="mt-2 text-sm text-red-400">
                    {emailError}
                  </p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Subject
                </label>

                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  maxLength={150}
                  placeholder="What would you like to build?"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Message */}
            <div className="mt-5">
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Message
              </label>

              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                maxLength={2000}
                rows={7}
                placeholder="Tell me about your project..."
                className="w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
              />

              <div className="mt-2 text-right text-xs text-slate-500">
                {formData.message.length}/2000
              </div>
            </div>

            {/* Error / Success */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                >
                  {error}
                </motion.div>
              )}

              {submitted && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-5 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400"
                >
                  Your message has been sent successfully.
                  I&apos;ll get back to you soon.
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={
                !isSubmitting
                  ? { y: -2 }
                  : undefined
              }
              whileTap={
                !isSubmitting
                  ? { scale: 0.98 }
                  : undefined
              }
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-blue-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-slate-950" />
                  Sending...
                </>
              ) : (
                "Send Message →"
              )}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}

export default Contact