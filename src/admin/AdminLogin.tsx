import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { adminLogin } from "../services/api"

function AdminLogin() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setIsLoading(true)
    setError("")

    try {
      const data = await adminLogin(
        email.trim(),
        password
      )

      // Save JWT token
      localStorage.setItem(
        "adminToken",
        data.token
      )

      console.log("Login successful")

      // Go to admin dashboard
      navigate("/admin", {
        replace: true,
      })
    } catch (error) {
      console.error("Login error:", error)

      setError(
        error instanceof Error
          ? error.message
          : "Unable to login"
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
            Admin
          </p>

          <h1 className="mt-3 text-3xl font-bold text-white">
            Admin Login
          </h1>

          <p className="mt-3 text-slate-400">
            Sign in to manage your portfolio.
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8"
        >
          {/* Email */}
          <div>
            <label
              htmlFor="admin-email"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Email
            </label>

            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Admin email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="admin-password"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Password
            </label>

            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Admin password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
            />
          </div>

          {/* Error */}
          {error && (
            <p
              role="alert"
              className="text-sm text-red-400"
            >
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-blue-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading
              ? "Signing in..."
              : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin