import { useState } from 'react'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    console.log('CHANGING')
    setValue(event.target.value)
  }

  const reset = () => {
    console.log('RESETTING')
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    reset
  }
}
