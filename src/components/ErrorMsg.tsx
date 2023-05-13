import { forwardRef } from 'react'

import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'

interface ErrorMsgProps {
  error?: SerializedError | FetchBaseQueryError
  errorMsg?: string
  customClass?: string
}

const ErrorMsg = forwardRef<HTMLParagraphElement, ErrorMsgProps>(({ error, customClass = 'errmsg', errorMsg = '' }, ref) => {
  const err = error as FetchBaseQueryError | undefined

  if (errorMsg)
    return (
      <p ref={ref} className={customClass}>
        {errorMsg}
      </p>
    )

  if (!err) return null

  if (err.data) {
    const { message } = err.data as { message: string }
    return (
      <p ref={ref} className={customClass}>
        {message}
      </p>
    )
  }

  const content = typeof err.status === 'number' ? err.status : err.error
  return (
    <p ref={ref} className={customClass}>
      {content}
    </p>
  )
})

export default ErrorMsg
