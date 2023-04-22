import User from './User'
import { useGetUsersQuery } from './usersApiSlice'

import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'

const UsersList = () => {
  const { data: users, isLoading, isSuccess, isError, error } = useGetUsersQuery()

  if (isLoading) return <p>Loading...</p>

  if (isError) {
    const err = error as FetchBaseQueryError
    const content = typeof err.status === 'number' ? err.status : err.error
    return <p className="errMsg">{content}</p>
  }

  if (isSuccess) {
    const { ids } = users

    const tableContent = ids?.length ? ids.map((userId) => <User key={userId} userId={`${userId}`} />) : null

    return (
      <table className="table table--users">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th user__username">
              Username
            </th>
            <th scope="col" className="table__th user__roles">
              Roles
            </th>
            <th scope="col" className="table__th user__edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    )
  }

  return null
}
export default UsersList
