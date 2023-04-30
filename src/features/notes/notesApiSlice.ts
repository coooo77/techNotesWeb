import { createEntityAdapter, createSelector } from '@reduxjs/toolkit'
import { apiSlice } from '../../app/api/apiSlice'

import type { RootState } from '../../app/store'
import type { EntityState } from '@reduxjs/toolkit'

interface NoteData {
  user: string
  title: string
  text: string
  ticket: string
  completed: boolean
  createdAt: string
  updatedAt: string
  username: string
}

interface NoteRes extends NoteData {
  _id: string
}

type ParamAddNewNote = Omit<NoteData, 'completed' | 'createdAt' | 'updatedAt' | 'username' | 'ticket'>

type ParamUpdateNote = Omit<Note, 'createdAt' | 'updatedAt' | 'username' | 'ticket'>

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

    addNewNote: builder.mutation<Note, ParamAddNewNote>({
      query: (initialNote) => ({
        url: '/notes',
        method: 'POST',
        body: {
          ...initialNote,
        },
      }),
      invalidatesTags: [{ type: 'Note', id: 'LIST' }],
    }),

    updateNote: builder.mutation<Note, ParamUpdateNote>({
      query: (initialNote) => ({
        url: '/notes',
        method: 'PATCH',
        body: {
          ...initialNote,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Note', id: arg.id }],
    }),

    deleteNote: builder.mutation<void, {id: string}>({
      query: ({ id }) => ({
        url: `/notes`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Note', id: arg.id }],
    }),
  }),
})


export const {
    useGetNotesQuery,
    useAddNewNoteMutation,
    useUpdateNoteMutation,
    useDeleteNoteMutation,
} = notesApiSlice

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