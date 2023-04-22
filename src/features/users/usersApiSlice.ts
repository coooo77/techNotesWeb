import { createEntityAdapter, createSelector } from '@reduxjs/toolkit'
import { apiSlice } from '../../app/api/apiSlice'

import type { RootState } from '../../app/store'
import type { EntityState } from '@reduxjs/toolkit'

interface UserData {
  username: string
  password: string
  roles: string[]
  active: boolean
}

interface UserRes extends UserData {
  _id: string
}

export interface User extends UserData {
  id: string
}

const usersAdapter = createEntityAdapter<User>({})

const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<EntityState<User>, void>({
      query: () => '/users',
      // validateStatus: (response, result) => {
      //   return response.status === 200 && !result.error
      // },
      keepUnusedDataFor: 5,
      transformResponse: (responseData: UserRes[]) => {
        const loadedUsers = responseData.map((user) => ({ ...user, id: user._id }))
        return usersAdapter.setAll(initialState, loadedUsers)
      },
      providesTags: (result, error, arg) => {
        return result?.ids
          ? [{ type: 'User' as const, id: 'LIST' }, ...result.ids.map((id) => ({ type: 'User' as const, id }))]
          : [{ type: 'User' as const, id: 'LIST' }]
      },
    }),
  }),
})

export const { useGetUsersQuery } = usersApiSlice

export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data // normalized state object with ids & entities
)

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors((state: RootState) => selectUsersData(state) ?? initialState)
