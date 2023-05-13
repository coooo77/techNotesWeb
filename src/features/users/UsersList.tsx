import User from './User'
import { useGetUsersQuery } from './usersApiSlice'

import ErrorMsg from '../../components/ErrorMsg'
import PulseLoader from 'react-spinners/PulseLoader'

const UsersList = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery(undefined, {
    pollingInterval: 1000 * 60,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  })

  if (isLoading) return <PulseLoader color={'#FFF'} />

  if (isError) return <ErrorMsg error={error} />

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
