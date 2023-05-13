import { useRef, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import ErrorMsg from '../../components/ErrorMsg'
import PulseLoader from 'react-spinners/PulseLoader'

import { setCredentials } from './authSlice'
import { useAppDispatch } from '../../app/utils'
import { useLoginMutation } from './authApiSlice'
import usePersist from '../../hooks/usePersist'

import type { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'

const Login = () => {
  const errRef = useRef<HTMLParagraphElement>(null)
  const userRef = useRef<HTMLInputElement>(null)
  const [errMsg, setErrMsg] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [persist, setPersist] = usePersist()

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [login, { isLoading }] = useLoginMutation()

  useEffect(() => {
    userRef.current?.focus()
  }, [])

  useEffect(() => {
    setErrMsg('')
  }, [username, password])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const { accessToken } = await login({ username, password }).unwrap()
      dispatch(setCredentials({ accessToken }))
      setUsername('')
      setPassword('')
      navigate('/dash')
    } catch (err) {
      const error = err as FetchBaseQueryError
      if (!error.status) {
        setErrMsg('No Server Response')
      } else if (error.status === 400) {
        setErrMsg('Missing Username or Password')
      } else if (error.status === 401) {
        setErrMsg('Unauthorized')
      } else if (error.data) {
        const { message } = error.data as { message: string }
        setErrMsg(message)
      } else {
        setErrMsg(`Unknown error ${JSON.stringify(error)}`)
      }
      errRef.current?.focus()
    }
  }

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)
  const handlePwdInput = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)
  const handleToggle = () => setPersist((prev) => !prev)

  const errClass = errMsg ? 'errmsg' : 'offscreen'

  if (isLoading) return <PulseLoader color={'#FFF'} />

  return (
    <section className="public">
      <header>
        <h1>Employee Login</h1>
      </header>

      <main className="login">
        <ErrorMsg errorMsg={errMsg} ref={errRef} customClass={errClass} />

        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            className="form__input"
            type="text"
            id="username"
            ref={userRef}
            value={username}
            onChange={handleUserInput}
            autoComplete="off"
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            className="form__input"
            type="password"
            id="password"
            onChange={handlePwdInput}
            value={password}
            required
          />
          <button className="form__submit-button">Sign In</button>

          <label htmlFor="persist" className="form__persist">
            <input
              type="checkbox"
              className="form__checkbox"
              id="persist"
              onChange={handleToggle}
              checked={persist}
            />
            Trust This Device
          </label>
        </form>
      </main>
      
      <footer>
        <Link to="/">Back to Home</Link>
      </footer>
    </section>
  )
}
export default Login
