'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ShareScreen from '@/components/builder/ShareScreen'
import { pagesApi, aiApi, authApi, mediaApi } from '@/lib/apiEndpoints'

export default function CreatePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shareData, setShareData] = useState<{ slug: string; url: string } | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  const [formData, setFormData] = useState<any>({
    recipientName: '', nickname: '', age: '', birthdayDate: '',
    senderName: '', relationship: 'Friend', personalMessage: '',
    photos: [] as File[],
    photoPreviews: [] as string[],
    video: null as File | null,
    customSong: null as File | null,
    slideshowSong: null as File | null,
    voiceMsg: null as File | null,
    balloonPhoto: null as File | null,
    balloonPhotoPreview: '',
    theme: 'classic_gold',
    cakeTheme: 'default',
    isCalmModeDefault: false,
    isPasswordProtected: false,
    password: '',
    scheduledReveal: '',
  })

  const photoInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const songInputRef = useRef<HTMLInputElement>(null)
  const slideshowSongInputRef = useRef<HTMLInputElement>(null)
  const voiceInputRef = useRef<HTMLInputElement>(null)
  const balloonPhotoInputRef = useRef<HTMLInputElement>(null)

  const set = (key: string, val: any) => setFormData((prev: any) => ({ ...prev, [key]: val }))

  // ── Photo upload (multiple) ──
  const handlePhotos = (files: FileList | null) => {
    if (!files) return
    const arr = Array.from(files)
    const previews = arr.map(f => URL.createObjectURL(f))
    setFormData((prev: any) => ({
      ...prev,
      photos: [...prev.photos, ...arr],
      photoPreviews: [...prev.photoPreviews, ...previews],
    }))
  }

  const removePhoto = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      photos: prev.photos.filter((_: any, i: number) => i !== index),
      photoPreviews: prev.photoPreviews.filter((_: any, i: number) => i !== index),
    }))
  }

  // ── AI message ──
  const handleAiMessage = async () => {
    if (!formData.recipientName) return
    setAiLoading(true)
    try {
      const res = await aiApi.generateMessage({
        recipientName: formData.recipientName,
        relationship: formData.relationship,
      })
      set('personalMessage', res.message || res)
    } catch {
      // fallback
      const fallbacks = [
        `Happy Birthday ${formData.recipientName}! 🎂 Wishing you a day as wonderful as you are. May this year bring you joy, adventure, and everything your heart desires. You deserve all the happiness in the world! 🌟`,
        `To my amazing ${formData.relationship.toLowerCase()}, ${formData.recipientName} — on your special day, I want you to know how much you mean to me. Here's to celebrating YOU and all the magic you bring into the world! 🎉`,
      ]
      set('personalMessage', fallbacks[Math.floor(Math.random() * fallbacks.length)])
    } finally {
      setAiLoading(false)
    }
  }

  // ── Generate Celebration ──
  const handleGenerate = async () => {
    if (!formData.recipientName.trim()) {
      setError("Please enter the birthday person's name.")
      return
    }
    setLoading(true)
    setError(null)

    try {
      // 1. Get auth token
      if (typeof window !== 'undefined' && !localStorage.getItem('cv_token')) {
        const auth = await authApi.guestToken()
        localStorage.setItem('cv_token', auth.token)
      }

      // 2. Create page
      const res = await pagesApi.create({
        recipientName: formData.recipientName || undefined,
        recipientNickname: formData.nickname || undefined,
        recipientAge: formData.age ? parseInt(formData.age) : undefined,
        recipientBirthday: formData.birthdayDate || undefined,
        senderName: formData.senderName || undefined,
        senderRelationship: formData.relationship || undefined,
        personalMessage: formData.personalMessage || undefined,
        theme: formData.theme || 'classic_gold',
        cakeTheme: formData.cakeTheme || 'default',
        mode: 'PERSONALIZED' as any,
        isCalmModeDefault: formData.isCalmModeDefault,
        isPasswordProtected: formData.isPasswordProtected,
        pagePassword: formData.isPasswordProtected ? formData.password : undefined,
        revealAt: formData.scheduledReveal || undefined,
      })

      const pageId = res.id

      // 3. Upload media
      for (const photo of formData.photos) {
        await mediaApi.upload(pageId, photo, 'PHOTO').catch(e => console.error('Photo upload error:', e))
      }
      if (formData.video) await mediaApi.upload(pageId, formData.video, 'VIDEO').catch(console.error)
      if (formData.customSong) await mediaApi.upload(pageId, formData.customSong, 'MUSIC').catch(console.error)
      if (formData.slideshowSong) await mediaApi.upload(pageId, formData.slideshowSong, 'SLIDESHOW_MUSIC').catch(console.error)
      if (formData.voiceMsg) await mediaApi.upload(pageId, formData.voiceMsg, 'VOICE_NOTE').catch(console.error)
      if (formData.balloonPhoto) await mediaApi.upload(pageId, formData.balloonPhoto, 'BALLOON_PHOTO').catch(console.error)

      setShareData({ slug: res.slug, url: `${window.location.origin}/p/${res.slug}` })
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Render states ──
  if (shareData) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-4">
        <ShareScreen slug={shareData.slug} shareUrl={shareData.url} />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center text-white">
        <div className="relative w-20 h-20 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-pink-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-pink-500 border-t-transparent animate-spin" />
          <span className="absolute inset-0 flex items-center justify-center text-3xl">🎂</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Creating your magic...</h2>
        <p className="text-white/40 text-sm">Uploading media and building your celebration</p>
      </div>
    )
  }

  const themes = [
    { key: 'classic_gold', label: 'Classic Gold', colors: ['#D4AF37', '#1a1206'], emoji: '✨' },
    { key: 'pastel_dream', label: 'Pastel Dream', colors: ['#FF8FAB', '#1a0d1a'], emoji: '🌸' },
    { key: 'neon_night', label: 'Neon Night', colors: ['#FF6B9D', '#0a0014'], emoji: '🌙' },
  ]
  const cakeThemes = [
    { key: 'default', label: 'Classic Pink', emoji: '🍰' },
    { key: 'chocolate', label: 'Chocolate', emoji: '🍫' },
    { key: 'rainbow', label: 'Rainbow', emoji: '🌈' },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">🎂</div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 bg-clip-text text-transparent mb-3">
            Build a Celebration
          </h1>
          <p className="text-white/50">Create a magical birthday experience in minutes</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-xl mb-8 flex items-start gap-3">
            <span className="text-xl mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-6">

          {/* ── Section 1: Birthday Person ── */}
          <section className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <span className="w-7 h-7 bg-pink-500/20 rounded-full flex items-center justify-center text-sm">1</span>
              Birthday Person
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name *"
                value={formData.recipientName}
                onChange={e => set('recipientName', e.target.value)}
                className="bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-pink-500/50 focus:outline-none transition-colors"
              />
              <input
                type="text"
                placeholder="Nickname (optional)"
                value={formData.nickname}
                onChange={e => set('nickname', e.target.value)}
                className="bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-pink-500/50 focus:outline-none transition-colors"
              />
              <input
                type="number"
                placeholder="Age (optional)"
                value={formData.age}
                onChange={e => set('age', e.target.value)}
                className="bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-pink-500/50 focus:outline-none transition-colors"
              />
              <input
                type="date"
                value={formData.birthdayDate}
                onChange={e => set('birthdayDate', e.target.value)}
                className="bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white/70 focus:border-pink-500/50 focus:outline-none transition-colors"
              />
            </div>
          </section>

          {/* ── Section 2: From You ── */}
          <section className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <span className="w-7 h-7 bg-purple-500/20 rounded-full flex items-center justify-center text-sm">2</span>
              From You
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.senderName}
                  onChange={e => set('senderName', e.target.value)}
                  className="bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-purple-500/50 focus:outline-none transition-colors"
                />
                <select
                  value={formData.relationship}
                  onChange={e => set('relationship', e.target.value)}
                  className="bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500/50 focus:outline-none transition-colors"
                >
                  {['Friend', 'Partner', 'Parent', 'Sibling', 'Colleague', 'Other'].map(r => (
                    <option key={r} value={r} className="bg-gray-900">{r}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <textarea
                  placeholder="Personal message to write in the letter slide..."
                  maxLength={600}
                  value={formData.personalMessage}
                  onChange={e => set('personalMessage', e.target.value)}
                  rows={4}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-purple-500/50 focus:outline-none resize-none transition-colors"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-white/30 text-xs">{formData.personalMessage.length}/600</span>
                  <button
                    onClick={handleAiMessage}
                    disabled={aiLoading || !formData.recipientName}
                    className="flex items-center gap-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 text-xs px-4 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {aiLoading ? (
                      <span className="w-3 h-3 border border-purple-400 border-t-transparent rounded-full animate-spin" />
                    ) : '✨'}
                    AI Generate Message
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 3: Media ── */}
          <section className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <span className="w-7 h-7 bg-yellow-500/20 rounded-full flex items-center justify-center text-sm">3</span>
              Photos & Media
              <span className="text-white/30 text-sm font-normal ml-1">(optional)</span>
            </h2>

            {/* Photos */}
            <div className="mb-6">
              <label className="text-white/60 text-sm mb-3 block">📸 Photos (slideshow)</label>
              <div
                onClick={() => photoInputRef.current?.click()}
                className="border-2 border-dashed border-white/15 rounded-xl p-6 text-center cursor-pointer hover:border-pink-500/40 hover:bg-pink-500/5 transition-all"
              >
                <div className="text-3xl mb-2">📷</div>
                <p className="text-white/50 text-sm">Click to add photos</p>
                <p className="text-white/30 text-xs mt-1">JPG, PNG, WEBP • Multiple allowed</p>
              </div>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={e => handlePhotos(e.target.files)}
              />
              {formData.photoPreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {formData.photoPreviews.map((src: string, i: number) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                      <img src={src} className="w-full h-full object-cover" alt="" />
                      <button
                        onClick={() => removePhoto(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs hidden group-hover:flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div
                    onClick={() => photoInputRef.current?.click()}
                    className="aspect-square rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-pink-500/50 transition-colors"
                  >
                    <span className="text-white/40 text-2xl">+</span>
                  </div>
                </div>
              )}
            </div>

            {/* Video */}
            <div className="mb-4">
              <label className="text-white/60 text-sm mb-2 block">🎬 Video message (optional)</label>
              <div
                onClick={() => videoInputRef.current?.click()}
                className="flex items-center gap-3 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 cursor-pointer hover:border-purple-500/40 transition-colors"
              >
                <span className="text-2xl">🎥</span>
                <div className="flex-1">
                  <p className="text-white/70 text-sm">
                    {formData.video ? formData.video.name : 'Upload a video'}
                  </p>
                  <p className="text-white/30 text-xs">MP4, MOV, WEBM</p>
                </div>
                {formData.video && (
                  <button
                    onClick={e => { e.stopPropagation(); set('video', null) }}
                    className="text-white/30 hover:text-red-400 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
              <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={e => set('video', e.target.files?.[0] || null)} />
            </div>

            {/* Custom Song */}
            <div className="mb-4">
              <label className="text-white/60 text-sm mb-2 block">🎵 Custom background song (optional)</label>
              <div
                onClick={() => songInputRef.current?.click()}
                className="flex items-center gap-3 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 cursor-pointer hover:border-yellow-500/40 transition-colors"
              >
                <span className="text-2xl">🎶</span>
                <div className="flex-1">
                  <p className="text-white/70 text-sm">
                    {formData.customSong ? formData.customSong.name : 'Upload a song'}
                  </p>
                  <p className="text-white/30 text-xs">MP3, WAV, OGG • Plays as background music</p>
                </div>
                {formData.customSong && (
                  <button onClick={e => { e.stopPropagation(); set('customSong', null) }} className="text-white/30 hover:text-red-400 transition-colors">✕</button>
                )}
              </div>
              <input ref={songInputRef} type="file" accept="audio/*" className="hidden" onChange={e => set('customSong', e.target.files?.[0] || null)} />
            </div>

            {/* Slideshow Song */}
            <div className="mb-4">
              <label className="text-white/60 text-sm mb-2 block">🎵 Slideshow Cover Song (optional)</label>
              <div
                onClick={() => slideshowSongInputRef.current?.click()}
                className="flex items-center gap-3 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 cursor-pointer hover:border-blue-500/40 transition-colors"
              >
                <span className="text-2xl">🎧</span>
                <div className="flex-1">
                  <p className="text-white/70 text-sm">
                    {formData.slideshowSong ? formData.slideshowSong.name : 'Upload a slideshow song'}
                  </p>
                  <p className="text-white/30 text-xs">Plays during the surprise reveal</p>
                </div>
                {formData.slideshowSong && (
                  <button onClick={e => { e.stopPropagation(); set('slideshowSong', null) }} className="text-white/30 hover:text-red-400 transition-colors">✕</button>
                )}
              </div>
              <input ref={slideshowSongInputRef} type="file" accept="audio/*" className="hidden" onChange={e => set('slideshowSong', e.target.files?.[0] || null)} />
            </div>

            {/* Voice Message */}
            <div className="mb-4">
              <label className="text-white/60 text-sm mb-2 block">🎤 Voice message (optional)</label>
              <div
                onClick={() => voiceInputRef.current?.click()}
                className="flex items-center gap-3 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 cursor-pointer hover:border-green-500/40 transition-colors"
              >
                <span className="text-2xl">🎤</span>
                <div className="flex-1">
                  <p className="text-white/70 text-sm">
                    {formData.voiceMsg ? formData.voiceMsg.name : 'Upload a voice note'}
                  </p>
                  <p className="text-white/30 text-xs">Plays in a dedicated slide with waveform</p>
                </div>
                {formData.voiceMsg && (
                  <button onClick={e => { e.stopPropagation(); set('voiceMsg', null) }} className="text-white/30 hover:text-red-400 transition-colors">✕</button>
                )}
              </div>
              <input ref={voiceInputRef} type="file" accept="audio/*" className="hidden" onChange={e => set('voiceMsg', e.target.files?.[0] || null)} />
            </div>

            {/* Balloon Photo */}
            <div>
              <label className="text-white/60 text-sm mb-2 block">🎈 Photo for balloon (optional)</label>
              <div
                onClick={() => balloonPhotoInputRef.current?.click()}
                className="flex items-center gap-3 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 cursor-pointer hover:border-pink-500/40 transition-colors"
              >
                <span className="text-2xl">🎈</span>
                <div className="flex-1">
                  <p className="text-white/70 text-sm">
                    {formData.balloonPhoto ? formData.balloonPhoto.name : 'A photo to appear on a balloon'}
                  </p>
                  {formData.balloonPhotoPreview && (
                    <img src={formData.balloonPhotoPreview} alt="" className="w-10 h-10 rounded-full object-cover mt-2" />
                  )}
                </div>
                {formData.balloonPhoto && (
                  <button onClick={e => { e.stopPropagation(); set('balloonPhoto', null); set('balloonPhotoPreview', '') }} className="text-white/30 hover:text-red-400 transition-colors">✕</button>
                )}
              </div>
              <input
                ref={balloonPhotoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0] || null
                  set('balloonPhoto', file)
                  if (file) set('balloonPhotoPreview', URL.createObjectURL(file))
                }}
              />
            </div>
          </section>

          {/* ── Section 4: Theme ── */}
          <section className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-500/20 rounded-full flex items-center justify-center text-sm">4</span>
              Customize
            </h2>

            <label className="text-white/50 text-xs uppercase tracking-wider mb-3 block">Color Theme</label>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {themes.map(t => (
                <button
                  key={t.key}
                  onClick={() => set('theme', t.key)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    formData.theme === t.key
                      ? 'border-pink-500 bg-pink-500/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  style={{ background: formData.theme === t.key ? undefined : t.colors[1] }}
                >
                  <div className="text-2xl mb-1">{t.emoji}</div>
                  <div className="text-xs font-semibold" style={{ color: t.colors[0] }}>{t.label}</div>
                </button>
              ))}
            </div>

            <label className="text-white/50 text-xs uppercase tracking-wider mb-3 block">Cake Style</label>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {cakeThemes.map(t => (
                <button
                  key={t.key}
                  onClick={() => set('cakeTheme', t.key)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    formData.cakeTheme === t.key
                      ? 'border-yellow-500 bg-yellow-500/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="text-2xl mb-1">{t.emoji}</div>
                  <div className="text-xs font-semibold text-white/70">{t.label}</div>
                </button>
              ))}
            </div>

            {/* Advanced toggles */}
            <div className="space-y-3 pt-4 border-t border-white/[0.06]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">🧘 Calm Mode</p>
                  <p className="text-white/30 text-xs">Gentle animations, no confetti or loud effects</p>
                </div>
                <button
                  onClick={() => set('isCalmModeDefault', !formData.isCalmModeDefault)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${formData.isCalmModeDefault ? 'bg-green-500' : 'bg-white/20'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${formData.isCalmModeDefault ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">🔒 Password Protect</p>
                  <p className="text-white/30 text-xs">Only recipients with the password can view</p>
                </div>
                <button
                  onClick={() => set('isPasswordProtected', !formData.isPasswordProtected)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${formData.isPasswordProtected ? 'bg-pink-500' : 'bg-white/20'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${formData.isPasswordProtected ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
              {formData.isPasswordProtected && (
                <input
                  type="password"
                  placeholder="Set a password"
                  value={formData.password}
                  onChange={e => set('password', e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-pink-500/50 focus:outline-none"
                />
              )}
            </div>
          </section>

          {/* ── Generate Button ── */}
          <motion.button
            onClick={handleGenerate}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-5 rounded-2xl font-black text-xl text-white shadow-[0_0_40px_rgba(236,72,153,0.4)] transition-all"
            style={{ background: 'linear-gradient(135deg, #FF6B9D, #C44AFF, #FFD700)' }}
          >
            Generate Celebration 🪄
          </motion.button>

          <p className="text-center text-white/20 text-sm">Your page will be ready instantly</p>
        </div>
      </div>
    </div>
  )
}
