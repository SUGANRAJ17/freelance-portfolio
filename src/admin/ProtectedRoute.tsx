import { Navigate } from "react-router-dom"

import { getAdminToken } from "../services/api"

interface ProtectedRouteProps {
  children: React.ReactNode
}

function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const token = getAdminToken()

  if (!token) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    )
  }

  return <>{children}</>
}

export default ProtectedRoute