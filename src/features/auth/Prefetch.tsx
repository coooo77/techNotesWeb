import { store } from '../../app/store'
import { notesApiSlice } from '../notes/notesApiSlice'
import { usersApiSlice } from '../users/usersApiSlice'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const Prefetch = () => {
  useEffect(() => {
    console.log('subscribing')
    const notes = store.dispatch(notesApiSlice.endpoints.getNotes.initiate())
    const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())

    return () => {
      /** @see https://redux-toolkit.js.org/rtk-query/usage/usage-without-react-hooks#removing-a-subscription */
      console.log('unsubscribing')
      notes.unsubscribe()
      users.unsubscribe()
    }
  }, [])

  return <Outlet />
}
export default Prefetch
