import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  message: string
  variant: ToastVariant
  duration?: number
}

type ModalType = 'login' | 'register' | 'confirmDelete' | 'passwordEntry' | 'lightbox' | null

interface UiState {
  toasts: Toast[]
  activeModal: ModalType
  modalData: Record<string, unknown>
  isNavOpen: boolean
  isGuestbookOpen: boolean
  theme: 'classic_gold' | 'pastel_dream' | 'neon_night'
  lightboxIndex: number
  isPageLoading: boolean
}

const initialState: UiState = {
  toasts: [],
  activeModal: null,
  modalData: {},
  isNavOpen: false,
  isGuestbookOpen: false,
  theme: 'classic_gold',
  lightboxIndex: 0,
  isPageLoading: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const id = Date.now().toString() + Math.random().toString(36).slice(2)
      state.toasts.push({ ...action.payload, id })
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload)
    },
    clearToasts: (state) => {
      state.toasts = []
    },
    openModal: (state, action: PayloadAction<{ type: ModalType; data?: Record<string, unknown> }>) => {
      state.activeModal = action.payload.type
      state.modalData = action.payload.data || {}
    },
    closeModal: (state) => {
      state.activeModal = null
      state.modalData = {}
    },
    toggleNav: (state) => {
      state.isNavOpen = !state.isNavOpen
    },
    closeNav: (state) => {
      state.isNavOpen = false
    },
    toggleGuestbook: (state) => {
      state.isGuestbookOpen = !state.isGuestbookOpen
    },
    setTheme: (state, action: PayloadAction<'classic_gold' | 'pastel_dream' | 'neon_night'>) => {
      state.theme = action.payload
    },
    openLightbox: (state, action: PayloadAction<number>) => {
      state.lightboxIndex = action.payload
      state.activeModal = 'lightbox'
    },
    setPageLoading: (state, action: PayloadAction<boolean>) => {
      state.isPageLoading = action.payload
    },
  },
})

export const {
  addToast, removeToast, clearToasts, openModal, closeModal,
  toggleNav, closeNav, toggleGuestbook, setTheme, openLightbox, setPageLoading,
} = uiSlice.actions

export default uiSlice.reducer
