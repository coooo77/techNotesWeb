import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import useAuth from '../hooks/useAuth'

const DashFooter = () => {
  const { username, status } = useAuth()

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const onGoHomeClicked = () => navigate('/dash')

  const goHomeButton =
    pathname !== '/dash' ? (
      <button
        className="dash-footer__button icon-button"
        title="Home"
        onClick={onGoHomeClicked}
      >
        <FontAwesomeIcon icon={faHouse} />
      </button>
    ) : null

  return (
    <footer className="dash-footer">
      {goHomeButton}
      <p>Current User: {username}</p>
      <p>Status: {status}</p>
    </footer>
  )
}

export default DashFooter
