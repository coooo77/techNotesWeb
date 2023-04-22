import { createEntityAdapter, createSelector } from '@reduxjs/toolkit'
import { apiSlice } from '../../app/api/apiSlice'

import type { RootState } from '../../app/store'
import type { EntityState } from '@reduxjs/toolkit'

interface NoteData {
  user: string
  title: string
  text: string
  completed: boolean
  createdAt: string
  updatedAt: string
  username: string
}

interface NoteRes extends NoteData {
  _id: string
}

export interface Note extends NoteData {
  id: string
}

const notesAdapter = createEntityAdapter<Note>({
  sortComparer: (a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1),
})

const initialState = notesAdapter.getInitialState()

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query<EntityState<Note>, void>({
      query: () => '/notes',
      // validateStatus: (response, result) => {
      //   return response.status === 200 && !result.isError
      // },
      keepUnusedDataFor: 5,
      transformResponse: (responseData: NoteRes[]) => {
        const loadedNotes = responseData.map((note) => ({ ...note, id: note._id }))
        return notesAdapter.setAll(initialState, loadedNotes)
      },
      providesTags: (result, error, arg) => {
        return result?.ids
          ? [{ type: 'Note' as const, id: 'LIST' }, ...result.ids.map((id) => ({ type: 'Note' as const, id }))]
          : [{ type: 'Note' as const, id: 'LIST' }]
      },
    }),
  }),
})


export const { useGetNotesQuery } = notesApiSlice

export const selectNotesResult = notesApiSlice.endpoints.getNotes.select()

const selectNotesData = createSelector(
  selectNotesResult,
  (notesResult) => notesResult.data
)

export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
} = notesAdapter.getSelectors((state: RootState) => selectNotesData(state) ?? initialState)