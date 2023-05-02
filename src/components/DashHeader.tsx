import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, Link, useLocation } from 'react-router-dom'

import ErrorMsg from './ErrorMsg'

import { useSendLogoutMutation } from '../features/auth/authApiSlice'

const DASH_REGEX = /^\/dash(\/)?$/
const NOTES_REGEX = /^\/dash\/notes(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/
const authPageREGEXs = [DASH_REGEX, NOTES_REGEX, USERS_REGEX]

const DashHeader = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const [sendLogout, { isLoading, isSuccess, isError, error }] = useSendLogoutMutation()

  useEffect(() => {
    if (isSuccess) navigate('/')
  }, [isSuccess, navigate])

  if (isLoading) return <p>Logging Out...</p>

  if (isError) return <ErrorMsg error={error} />

  const dashClass = authPageREGEXs.every((regex) => !regex.test(pathname)) ? 'dash-header__container--small' : null

  const logoutButton = (
    <button className="icon-button" title="Logout" onClick={() => sendLogout()}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  )

  const content = (
    <header className="dash-header">
      <div className={`dash-header__container ${dashClass}`}>
        <Link to="/dash">
          <h1 className="dash-header__title">techNotes</h1>
        </Link>
        <nav className="dash-header__nav">
          {/* add more buttons later */}
          {logoutButton}
        </nav>
      </div>
    </header>
  )

  return content
}

export default DashHeader
