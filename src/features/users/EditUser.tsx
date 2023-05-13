import { useParams } from 'react-router-dom'

import EditUserForm from './EditUserForm'
import PulseLoader from 'react-spinners/PulseLoader'

import useTitle from '../../hooks/useTitle'
import { useGetUsersQuery } from './usersApiSlice'

const EditUser = () => {
  useTitle('techNotes: Edit User')

  const { id } = useParams()

  if (typeof id !== 'string') return <p>No id available</p>

  const { user } = useGetUsersQuery(undefined, {
    selectFromResult: ({ data }) => ({
      user: data?.entities[id],
    }),
  })

  const content = user ? <EditUserForm user={user} /> : <PulseLoader color={'#FFF'} />

  return content
}
export default EditUser
