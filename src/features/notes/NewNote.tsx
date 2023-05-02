import { useAppSelector } from '../../app/utils'
import { selectAllUsers } from '../users/usersApiSlice'
import NewNoteForm from './NewNoteForm'

const NewNote = () => {
  const users = useAppSelector(selectAllUsers)

  return users?.length ? <NewNoteForm users={users} /> : <p>Not Currently Available</p>
}
export default NewNote
