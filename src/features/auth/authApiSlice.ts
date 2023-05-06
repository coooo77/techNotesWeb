import { logOut, setCredentials } from './authSlice'
import { apiSlice } from '../../app/api/apiSlice'

interface LoginParameters {
  username: string
  password: string
}

interface LoginRes {
  accessToken: string
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginRes, LoginParameters>({
      query: (credentials) => ({
        url: '/auth',
        method: 'POST',
        body: credentials,
      }),
    }),

    sendLogout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(logOut(undefined))
          dispatch(apiSlice.util.resetApiState())
        } catch (err) {
          console.log(err)
        }
      },
    }),

    refresh: builder.mutation<{ accessToken: string }, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'GET',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log(data)
          const { accessToken } = data
          dispatch(setCredentials({ accessToken }))
        } catch (err) {
          console.log(err)
        }
      },
    }),
  }),
})

export const { useLoginMutation, useSendLogoutMutation, useRefreshMutation } = authApiSlice
