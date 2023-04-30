import { useParams } from 'react-router-dom'
import { useAppSelector } from '../../app/utils'
import { selectNoteById } from './notesApiSlice'
import { selectAllUsers } from '../users/usersApiSlice'

import EditNoteForm from './EditNoteForm'

const EditNote = () => {
  const { id } = useParams()

  if (typeof id !== 'string') return <p>No id available</p>

  const note = useAppSelector((state) => selectNoteById(state, id))
  const users = useAppSelector(selectAllUsers)

  const content = note && users ? <EditNoteForm note={note} users={users} /> : <p>Loading...</p>

  return content
}
export default EditNote
