import { useParams } from 'react-router-dom'

import EditNoteForm from './EditNoteForm'
import { PulseLoader } from 'react-spinners'
import ErrorMsg from '../../components/ErrorMsg'

import useAuth from '../../hooks/useAuth'
import useTitle from '../../hooks/useTitle'
import { useGetNotesQuery } from './notesApiSlice'
import { useGetUsersQuery } from '../users/usersApiSlice'

import type { User } from '../users/usersApiSlice'

const EditNote = () => {
  useTitle('techNotes: Edit Note')

  const { id } = useParams()

  if (typeof id !== 'string') return <p>No id available</p>

  const { username, isManager, isAdmin } = useAuth()

  const { note } = useGetNotesQuery(undefined, {
    selectFromResult: ({ data }) => ({
      note: data?.entities[id],
    }),
  })

  const { users } = useGetUsersQuery(undefined, {
    selectFromResult: ({ data, isSuccess }) => ({
      users: isSuccess ? data?.ids.map((id) => data?.entities[id]) : [],
    }),
  })

  const isNoAccess = !isManager && !isAdmin && note?.username !== username
  if (isNoAccess) return <ErrorMsg errorMsg='No access' />

  // prettier-ignore
  const content = note && users.length
    ? <EditNoteForm note={note} users={users as User[]} />
    : <PulseLoader color={'#FFF'} />

  return content
}
export default EditNote
