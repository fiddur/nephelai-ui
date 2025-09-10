import { signal } from '@preact/signals'
import axios from 'axios'

export const authState = () => {
  const auth = signal<{ user?: string; token?: string }>({})

  return { auth }
}

export const login = async (user: string, pass: string) => {
  console.log('Logging in', user, pass)

  const response = await axios.post<{ token: string }>('http://valhall/api/v2/login', {
    username: user,
    password: pass,
  })

  console.log(response)

  if (response.data.token) {
    const { auth } = authState()
    auth.value.user = user
    auth.value.token = response.data.token
  }
}
