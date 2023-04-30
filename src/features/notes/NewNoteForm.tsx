import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useAddNewNoteMutation } from './notesApiSlice'

import ErrorMsg from '../../components/ErrorMsg'

import type { User } from '../users/usersApiSlice'

const NewNoteForm = ({ users }: { users: User[] }) => {
  // prettier-ignore
  const [
    addNewNote,
    { isLoading, isSuccess, isError, error }
  ] = useAddNewNoteMutation()

  const navigate = useNavigate()

  const [text, setText] = useState('')
  const [title, setTitle] = useState('')
  const [userId, setUserId] = useState(users[0]?.id)

  useEffect(() => {
    if (users.length) setUserId(users[0]?.id)

    if (isSuccess) {
      setTitle('')
      setText('')
      setUserId('')
      navigate('/dash/notes')
    }
  }, [isSuccess, navigate, users])

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)
  const onTextChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)
  const onUserIdChanged = (e: React.ChangeEvent<HTMLSelectElement>) => setUserId(e.target.value)

  const canSave = [title, text, userId].every(Boolean) && !isLoading

  const onSaveNoteClicked = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (canSave) {
      console.log('addNewNote')
      await addNewNote({ user: userId, title, text }).unwrap()
    }
  }

  const options = users.map((user) => {
    return (
      <option key={user.id} value={user.id}>
        {' '}
        {user.username}
      </option>
    )
  })

  const errClass = isError ? 'errMsg' : 'offscreen'
  const validTitleClass = !title ? 'form__input--incomplete' : ''
  const validTextClass = !text ? 'form__input--incomplete' : ''

  const content = (
    <>
      <ErrorMsg error={error} customClass={errClass} />
      {/* <p className={errClass}>{error?.data?.message}</p> */}

      <form className="form" onSubmit={onSaveNoteClicked}>
        <div className="form__title-row">
          <h2>New Note</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>

        <label className="form__label" htmlFor="title">
          Title:
        </label>

        <input className={`form__input ${validTitleClass}`} id="title" name="title" type="text" autoComplete="off" value={title} onChange={onTitleChanged} />

        <label className="form__label" htmlFor="text">
          Text:
        </label>

        <textarea className={`form__input form__input--text ${validTextClass}`} id="text" name="text" value={text} onChange={onTextChanged} />

        <label className="form__label form__checkbox-container" htmlFor="username">
          ASSIGNED TO:
        </label>

        <select id="username" name="username" className="form__select" value={userId} onChange={onUserIdChanged}>
          {options}
        </select>
      </form>
    </>
  )

  return content
}

export default NewNoteForm
