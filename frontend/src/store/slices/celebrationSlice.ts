import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type CelebrationStage = 'opening' | 'celebration' | 'cake' | 'reveal' | 'complete'

export interface MediaAsset {
  id: number
  type: 'PHOTO' | 'VIDEO' | 'MUSIC' | 'VOICE_NOTE' | 'GIF' | 'STICKER'
  url: string
  sortOrder: number
}

export interface WishData {
  id: number
  authorName: string
  message: string
  photoUrl: string | null
  reactionEmoji: string | null
  createdAt: string
}

export interface PublicPageData {
  id: number
  slug: string
  mode: string
  recipientName: string | null
  recipientNickname: string | null
  recipientAge: number | null
  recipientBirthday: string | null
  favoriteColor: string | null
  favoriteMusicGenre: string | null
  senderName: string | null
  senderRelationship: string | null
  personalMessage: string | null
  aiGeneratedMessage: boolean
  theme: 'classic_gold' | 'pastel_dream' | 'neon_night'
  cakeTheme: string
  isCalmModeDefault: boolean
  revealAt: string | null
  mediaAssets: MediaAsset[]
  creatorAsset: { photoUrl: string | null; voiceMessageUrl: string | null } | null
  viewCount: number
}

interface CelebrationState {
  pageData: PublicPageData | null
  stage: CelebrationStage
  isCalmMode: boolean
  isMuted: boolean
  candlesBlown: boolean
  isLoading: boolean
  error: string | null
  wishes: WishData[]
  heartCount: number
  hasInteracted: boolean
}

const initialState: CelebrationState = {
  pageData: null,
  stage: 'opening',
  isCalmMode: false,
  isMuted: false,
  candlesBlown: false,
  isLoading: false,
  error: null,
  wishes: [],
  heartCount: 0,
  hasInteracted: false,
}

const celebrationSlice = createSlice({
  name: 'celebration',
  initialState,
  reducers: {
    setPageData: (state, action: PayloadAction<PublicPageData>) => {
      state.pageData = action.payload
      state.isCalmMode = action.payload.isCalmModeDefault
    },
    setStage: (state, action: PayloadAction<CelebrationStage>) => {
      state.stage = action.payload
    },
    advanceStage: (state) => {
      const order: CelebrationStage[] = ['opening', 'celebration', 'cake', 'reveal', 'complete']
      const current = order.indexOf(state.stage)
      if (current < order.length - 1) {
        state.stage = order[current + 1]
      }
    },
    toggleCalmMode: (state) => {
      state.isCalmMode = !state.isCalmMode
    },
    setCalmMode: (state, action: PayloadAction<boolean>) => {
      state.isCalmMode = action.payload
    },
    toggleMute: (state) => {
      state.isMuted = !state.isMuted
    },
    blowCandles: (state) => {
      state.candlesBlown = true
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.isLoading = false
    },
    setWishes: (state, action: PayloadAction<WishData[]>) => {
      state.wishes = action.payload
    },
    addWish: (state, action: PayloadAction<WishData>) => {
      state.wishes = [action.payload, ...state.wishes]
    },
    incrementHeart: (state) => {
      state.heartCount += 1
    },
    setHasInteracted: (state) => {
      state.hasInteracted = true
    },
    resetCelebration: () => initialState,
  },
})

export const {
  setPageData, setStage, advanceStage, toggleCalmMode, setCalmMode,
  toggleMute, blowCandles, setLoading, setError, setWishes, addWish,
  incrementHeart, setHasInteracted, resetCelebration,
} = celebrationSlice.actions

export default celebrationSlice.reducer
