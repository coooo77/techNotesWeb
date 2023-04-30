import { useAppSelector } from '../../app/utils'
import { selectAllUsers } from '../users/usersApiSlice'
import NewNoteForm from './NewNoteForm'

const NewNote = () => {
    const users = useAppSelector(selectAllUsers)

    return users ? <NewNoteForm users={users} /> : <p>Loading...</p>
}
export default NewNote