import useAuth from '../../hooks/useAuth'
import { useLocation, Navigate, Outlet } from 'react-router-dom'
import { ROLES } from '../../features/users/usersApiSlice'

interface Props {
  allowedRoles: ROLES[]
}

const RequireAuth = ({ allowedRoles }: Props) => {
  const location = useLocation()
  const { roles } = useAuth()
  const loginPage = <Navigate to="/login" state={{ from: location }} replace />

  return roles.some((role) => allowedRoles.includes(role)) ? <Outlet /> : loginPage
}
export default RequireAuth
