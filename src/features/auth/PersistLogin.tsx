import { Outlet, Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

import usePersist from '../../hooks/usePersist'
import { useAppSelector } from '../../app/utils'
import { selectCurrentToken } from './authSlice'
import { useRefreshMutation } from './authApiSlice'

import ErrorMsg from '../../components/ErrorMsg'

const PersistLogin = () => {
  const [persist] = usePersist()
  const effectRan = useRef(false)
  const token = useAppSelector(selectCurrentToken)

  const [trueSuccess, setTrueSuccess] = useState(false)

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] = useRefreshMutation()

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      // React 18 Strict Mode

      const verifyRefreshToken = async () => {
        console.log('verifying refresh token')
        try {
          //const response =
          await refresh()
          //const { accessToken } = response.data
          setTrueSuccess(true)
        } catch (err) {
          console.error(err)
        }
      }

      if (!token && persist) verifyRefreshToken()
    }

    return () => {
      effectRan.current = true
    }
  }, [])

  if (!persist) {
    // persist: no
    console.log('no persist')
    return <Outlet />
  } else if (isLoading) {
    //persist: yes, token: no
    console.log('loading')
    return <p>Loading...</p>
  } else if (isError) {
    //persist: yes, token: no
    console.log('error')
    return (
      <p className="errmsg">
        <ErrorMsg error={error} />
        <Link to="/login">Please login again</Link>.
      </p>
    )
  } else if (isSuccess && trueSuccess) {
    //persist: yes, token: yes
    console.log('success')
    return <Outlet />
  } else if (token && isUninitialized) {
    //persist: yes, token: yes
    console.log('token and refresh function is not called yet')
    console.log('isUninitialized:', isUninitialized)
    return <Outlet />
  } else {
    return null
  }
}

export default PersistLogin
