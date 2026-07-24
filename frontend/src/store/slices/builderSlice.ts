import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type BuilderMode = 'QUICK' | 'PERSONALIZED' | 'PREMIUM'

export interface PageFormData {
  // Birthday Person
  recipientName: string
  recipientNickname: string
  recipientAge: number | null
  recipientBirthday: string
  favoriteColor: string
  favoriteMusicGenre: string
  // Creator / Message
  senderName: string
  senderRelationship: string
  personalMessage: string
  // Theme
  theme: 'classic_gold' | 'pastel_dream' | 'neon_night'
  cakeTheme: string
  // Advanced
  isPasswordProtected: boolean
  pagePassword: string
  revealAt: string
  isCalmModeDefault: boolean
}

export interface GeneratedPage {
  id: number
  slug: string
  shareUrl: string
  qrCodeUrl: string
}

interface BuilderState {
  mode: BuilderMode
  step: 1 | 2 | 3
  formData: PageFormData
  generatedPage: GeneratedPage | null
  isGenerating: boolean
  isDirty: boolean
  activeSection: string | null
}

const defaultFormData: PageFormData = {
  recipientName: '',
  recipientNickname: '',
  recipientAge: null,
  recipientBirthday: '',
  favoriteColor: '#FF6B9D',
  favoriteMusicGenre: '',
  senderName: '',
  senderRelationship: '',
  personalMessage: '',
  theme: 'classic_gold',
  cakeTheme: 'default',
  isPasswordProtected: false,
  pagePassword: '',
  revealAt: '',
  isCalmModeDefault: false,
}

const initialState: BuilderState = {
  mode: 'QUICK',
  step: 1,
  formData: defaultFormData,
  generatedPage: null,
  isGenerating: false,
  isDirty: false,
  activeSection: null,
}

const builderSlice = createSlice({
  name: 'builder',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<BuilderMode>) => {
      state.mode = action.payload
    },
    setStep: (state, action: PayloadAction<1 | 2 | 3>) => {
      state.step = action.payload
    },
    updateFormData: (state, action: PayloadAction<Partial<PageFormData>>) => {
      state.formData = { ...state.formData, ...action.payload }
      state.isDirty = true
    },
    setGeneratedPage: (state, action: PayloadAction<GeneratedPage>) => {
      state.generatedPage = action.payload
      state.isGenerating = false
      state.step = 3
    },
    setGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload
    },
    setActiveSection: (state, action: PayloadAction<string | null>) => {
      state.activeSection = action.payload
    },
    resetBuilder: () => initialState,
  },
})

export const {
  setMode, setStep, updateFormData, setGeneratedPage,
  setGenerating, setActiveSection, resetBuilder,
} = builderSlice.actions

export default builderSlice.reducer
