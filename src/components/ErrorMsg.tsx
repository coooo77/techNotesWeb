import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'

interface ErrorMsgProps {
  error?: SerializedError | FetchBaseQueryError
  customClass?: string
}

const ErrorMsg = ({ error, customClass = 'errMsg' }: ErrorMsgProps) => {
  const err = error as FetchBaseQueryError | undefined

  if (!err) return <p className={customClass}>undefined error</p>

  if (err.data) {
    const { message } = err.data as { message: string }
    return <p className={customClass}>{message}</p>
  }

  const content = typeof err.status === 'number' ? err.status : err.error
  return <p className={customClass}>{content}</p>
}

export default ErrorMsg
