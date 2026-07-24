import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: number
  email: string
  displayName: string
  role: 'CREATOR' | 'ADMIN'
}

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  isGuest: boolean
  guestId: string | null
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('cv_token') : null,
  refreshToken: typeof window !== 'undefined' ? localStorage.getItem('cv_refresh') : null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isGuest: false,
  guestId: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string; refreshToken: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken
      state.isAuthenticated = true
      state.isGuest = false
      state.error = null
      if (typeof window !== 'undefined') {
        localStorage.setItem('cv_token', action.payload.token)
        localStorage.setItem('cv_refresh', action.payload.refreshToken)
      }
    },
    setGuestToken: (state, action: PayloadAction<{ token: string; guestId: string }>) => {
      state.token = action.payload.token
      state.guestId = action.payload.guestId
      state.isGuest = true
      state.isAuthenticated = true
      if (typeof window !== 'undefined') {
        localStorage.setItem('cv_token', action.payload.token)
      }
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.isGuest = false
      state.guestId = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cv_token')
        localStorage.removeItem('cv_refresh')
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.isLoading = false
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('cv_token', action.payload)
      }
    },
  },
})

export const { setCredentials, setGuestToken, logout, setLoading, setError, updateToken } = authSlice.actions
export default authSlice.reducer
