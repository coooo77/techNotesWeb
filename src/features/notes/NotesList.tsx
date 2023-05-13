import useAuth from '../../hooks/useAuth'
import { useGetNotesQuery } from './notesApiSlice'

import Note from './Note'
import ErrorMsg from '../../components/ErrorMsg'
import PulseLoader from 'react-spinners/PulseLoader'

const NotesList = () => {
  const { username, isManager, isAdmin } = useAuth()

  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotesQuery(undefined, {
    pollingInterval: 1000 * 60,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  })

  let content = null

  if (isLoading) content = <PulseLoader color={'#FFF'} />

  if (isError) content = <ErrorMsg error={error} />

  if (isSuccess) {
    const { ids, entities } = notes

    const filteredIds = (isManager || isAdmin) && username ? ids : ids.filter((noteId) => entities[noteId]?.username === username)

    const tableContent = ids?.length ? filteredIds.map((noteId) => <Note key={noteId} noteId={String(noteId)} />) : null

    content = (
      <table className="table table--notes">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th note__status">
              Username
            </th>
            <th scope="col" className="table__th note__created">
              Created
            </th>
            <th scope="col" className="table__th note__updated">
              Updated
            </th>
            <th scope="col" className="table__th note__title">
              Title
            </th>
            <th scope="col" className="table__th note__username">
              Owner
            </th>
            <th scope="col" className="table__th note__edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    )
  }

  return content
}
export default NotesList
