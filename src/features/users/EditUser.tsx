import { useParams } from 'react-router-dom'
import { selectUserById } from './usersApiSlice'
import { useAppSelector } from '../../app/utils'
import EditUserForm from './EditUserForm'

const EditUser = () => {
  const { id } = useParams()

   if (typeof id !== 'string') return <p>No id available</p>

  const user = useAppSelector((state) => selectUserById(state, id))

  const content = user ? <EditUserForm user={user} /> : <p>Loading...</p>

  return content
}
export default EditUser
