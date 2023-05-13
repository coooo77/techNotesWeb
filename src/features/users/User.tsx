import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'

import { useGetUsersQuery } from './usersApiSlice'

interface UserProps {
  userId: string
}

const User = ({ userId }: UserProps) => {
    const { user } = useGetUsersQuery(undefined, {
      selectFromResult: ({ data }) => ({
        user: data?.entities[userId],
      }),
    })

  const navigate = useNavigate()

  if (!user) return null

  const handleEdit = () => navigate(`/dash/users/${userId}`)

  const userRolesString = user.roles.join(', ')

  const cellStatus = user.active ? '' : 'table__cell--inactive'

  return (
    <tr className="table__row user">
      <td className={`table__cell ${cellStatus}`}>{user.username}</td>
      <td className={`table__cell ${cellStatus}`}>{userRolesString}</td>
      <td className={`table__cell ${cellStatus}`}>
        <button className="icon-button table__button" onClick={handleEdit}>
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
      </td>
    </tr>
  )
}

const memoizedUser = memo(User)

export default memoizedUser