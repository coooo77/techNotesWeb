import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { faFileCirclePlus, faFilePen, faUserGear, faUserPlus, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

import ErrorMsg from './ErrorMsg'
import PulseLoader from 'react-spinners/PulseLoader'

import useAuth from '../hooks/useAuth'
import { useSendLogoutMutation } from '../features/auth/authApiSlice'

const DASH_REGEX = /^\/dash(\/)?$/
const NOTES_REGEX = /^\/dash\/notes(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/
const authPageREGEXs = [DASH_REGEX, NOTES_REGEX, USERS_REGEX]

const DashHeader = () => {
  const { isManager, isAdmin } = useAuth()

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const [sendLogout, { isLoading, isSuccess, isError, error }] = useSendLogoutMutation()

  useEffect(() => {
    if (isSuccess) navigate('/')
  }, [isSuccess, navigate])

  const onNewNoteClicked = () => navigate('/dash/notes/new')
  const onNewUserClicked = () => navigate('/dash/users/new')
  const onNotesClicked = () => navigate('/dash/notes')
  const onUsersClicked = () => navigate('/dash/users')

  if (isLoading) return <p>Logging Out...</p>

  if (isError) return <ErrorMsg error={error} />

  const dashClass = authPageREGEXs.every((regex) => !regex.test(pathname)) ? 'dash-header__container--small' : null

  const newNoteButton = NOTES_REGEX.test(pathname) ? (
    <button className="icon-button" title="New Note" onClick={onNewNoteClicked}>
      <FontAwesomeIcon icon={faFileCirclePlus} />
    </button>
  ) : null

  const newUserButton = NOTES_REGEX.test(pathname) ? (
    <button className="icon-button" title="New User" onClick={onNewUserClicked}>
      <FontAwesomeIcon icon={faUserPlus} />
    </button>
  ) : null

  const isShowUserBtn = (isManager || isAdmin) && !USERS_REGEX.test(pathname) && pathname.includes('/dash')
  const userButton = isShowUserBtn ? (
    <button className="icon-button" title="Users" onClick={onUsersClicked}>
      <FontAwesomeIcon icon={faUserGear} />
    </button>
  ) : null

  const notesButton =
    !NOTES_REGEX.test(pathname) && pathname.includes('/dash') ? (
      <button className="icon-button" title="Notes" onClick={onNotesClicked}>
        <FontAwesomeIcon icon={faFilePen} />
      </button>
    ) : null

  const logoutButton = (
    <button className="icon-button" title="Logout" onClick={() => sendLogout()}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  )

  const buttonContent = isLoading ? (
    <p>Logging Out...</p>
  ) : (
    <>
      {newNoteButton}
      {newUserButton}
      {notesButton}
      {userButton}
      {logoutButton}
    </>
  )

  const errClass = isError ? 'errmsg' : 'offscreen'

  const content = (
    <>
      <ErrorMsg customClass={errClass} error={error} />

      <header className="dash-header">
        <div className={`dash-header__container ${dashClass}`}>
          <Link to="/dash">
            <h1 className="dash-header__title">techNotes</h1>
          </Link>
          <nav className="dash-header__nav">
            {buttonContent}
          </nav>
        </div>
      </header>
    </>
  )

  return content
}

export default DashHeader
