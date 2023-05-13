import jwtDecode from 'jwt-decode'

import { useAppSelector } from '../app/utils'
import { selectCurrentToken } from '../features/auth/authSlice'

import { ROLES } from '../features/users/usersApiSlice'

const useAuth = () => {
  const token = useAppSelector(selectCurrentToken)
  let isAdmin = false
  let isManager = false
  let status = ROLES.Employee

  if (token) {
    const decoded = jwtDecode(token) as { UserInfo: { username: string; roles: ROLES[] } }
    const { username, roles } = decoded.UserInfo

    isManager = roles.includes(ROLES.Manager)
    isAdmin = roles.includes(ROLES.Admin)

    if (isManager) status = ROLES.Manager
    if (isAdmin) status = ROLES.Admin

    return { username, roles, status, isManager, isAdmin }
  }

  return { username: '', roles: [], isManager, isAdmin, status }
}

export default useAuth
