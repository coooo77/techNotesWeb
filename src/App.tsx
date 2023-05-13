import { Routes, Route } from 'react-router-dom'

import Layout from './components/Layout'
import Public from './components/Public'
import DashLayout from './components/DashLayout'

import Login from './features/auth/Login'
import Welcome from './features/auth/Welcome'
import NewUserForm from './features/users/NewUserForm'
import EditUser from './features/users/EditUser'
import UsersList from './features/users/UsersList'
import NewNote from './features/notes/NewNote'
import EditNote from './features/notes/EditNote'
import NotesList from './features/notes/NotesList'

import Prefetch from './features/auth/Prefetch'
import RequireAuth from './features/auth/RequireAuth'
import PersistLogin from './features/auth/PersistLogin'

import useTitle from './hooks/useTitle'

import { ROLES } from './features/users/usersApiSlice'

const allRoles = Object.values(ROLES) as ROLES[]

function App() {
   useTitle('Dan D. Repairs')
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={allRoles} />}>
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>
                <Route index element={<Welcome />} />

                <Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />}>
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                </Route>

                <Route path="notes">
                  <Route index element={<NotesList />} />
                  <Route path=":id" element={<EditNote />} />
                  <Route path="new" element={<NewNote />} />
                </Route>
              </Route>
            </Route>
          </Route>
          {/* End Dash */}
        </Route>
        {/* End Protected Routes */}
        
      </Route>
    </Routes>
  )
}

export default App
