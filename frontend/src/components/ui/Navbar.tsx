'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { logout } from '@/store/slices/authSlice'
import { closeNav, toggleNav } from '@/store/slices/uiSlice'
import Button from './Button'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/create', label: 'Create' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useDispatch()
  const { isAuthenticated, user, isGuest } = useSelector((s: RootState) => s.auth)
  const isNavOpen = useSelector((s: RootState) => s.ui.isNavOpen)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isRecipientPage = pathname?.startsWith('/p/')
  if (isRecipientPage) return null

  const handleLogout = () => {
    dispatch(logout())
    setUserMenuOpen(false)
    router.push('/')
  }

  const initials = user?.displayName
    ? user.displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={[
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled ? 'bg-dark/80 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.4)]' : 'bg-transparent',
      ].join(' ')}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" onClick={() => dispatch(closeNav())}>
          <span className="text-2xl select-none group-hover:scale-110 transition-transform duration-200">🎂</span>
          <span className="font-display font-bold text-xl gradient-text hidden sm:block">CelebrateVerse</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className={['px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                pathname === link.href ? 'text-white bg-white/10' : 'text-text-muted hover:text-white hover:bg-white/5'].join(' ')}>
              {link.label}
            </Link>
          ))}
          {isAuthenticated && !isGuest && (
            <Link href="/dashboard"
              className={['px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                pathname === '/dashboard' ? 'text-white bg-white/10' : 'text-text-muted hover:text-white hover:bg-white/5'].join(' ')}>
              Dashboard
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && !isGuest ? (
            <div className="relative">
              <button onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass hover:bg-white/10 transition-all">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-xs font-bold text-white">{initials}</div>
                <span className="text-sm text-text-muted max-w-[100px] truncate">{user?.displayName}</span>
                <svg className={`w-4 h-4 text-text-muted transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-48 glass-strong rounded-xl overflow-hidden shadow-card z-50">
                    <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-white/10 transition-colors">📊 My Pages</Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-white/10 transition-colors">🚪 Sign Out</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => router.push('/create')}>Log in</Button>
              <Button variant="glow" size="sm" onClick={() => router.push('/create')}>Create Birthday ✨</Button>
            </>
          )}
        </div>

        <button onClick={() => dispatch(toggleNav())}
          className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/10 transition-colors"
          aria-label={isNavOpen ? 'Close menu' : 'Open menu'}>
          <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${isNavOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${isNavOpen ? 'opacity-0' : ''}`} />
          <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${isNavOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      <AnimatePresence>
        {isNavOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-dark/95 backdrop-blur-xl border-b border-white/08">
            <div className="px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => dispatch(closeNav())}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-text-muted hover:text-white hover:bg-white/10 transition-all">{link.label}</Link>
              ))}
              {isAuthenticated && !isGuest && (
                <Link href="/dashboard" onClick={() => dispatch(closeNav())} className="px-4 py-3 rounded-lg text-sm font-medium text-text-muted hover:text-white hover:bg-white/10 transition-all">Dashboard</Link>
              )}
              <div className="pt-2 border-t border-white/08 mt-2">
                <Button variant="glow" size="md" fullWidth onClick={() => { router.push('/create'); dispatch(closeNav()) }}>Create Birthday ✨</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
