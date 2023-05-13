import useTitle from '../../hooks/useTitle'
import { User, useGetUsersQuery } from '../users/usersApiSlice'

import NewNoteForm from './NewNoteForm'
import PulseLoader from 'react-spinners/PulseLoader'

const NewNote = () => {
  useTitle('techNotes: New Note')

  const { users } = useGetUsersQuery(undefined, {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]) || []
    }),
  })

  return users?.length ? <NewNoteForm users={users as User[]} /> : <PulseLoader color={'#FFF'} />
}
export default NewNote
