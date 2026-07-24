'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import StarField from '@/components/celebration/StarField'

/* ─── Animation variants ────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

/* ─── Section entrance hook ─────────────────────────────────── */
function useSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return { ref, inView }
}

/* ─── Feature cards data ─────────────────────────────────────── */
const features = [
  { icon: '🎂', title: '3D Birthday Cake', desc: 'Blow out candles with your mic or keyboard. Watch the magic happen.' },
  { icon: '✨', title: 'Cinematic Opening', desc: 'A movie-like reveal sequence your recipient will never forget.' },
  { icon: '📸', title: 'Photo Gallery', desc: 'Polaroid-style masonry wall with a lightbox. Memories, beautifully displayed.' },
  { icon: '🎵', title: 'Custom Music', desc: 'Upload a personal soundtrack or use our built-in birthday melody.' },
  { icon: '🎉', title: 'Live Guestbook', desc: 'Friends and family can add wishes with emoji reactions in real time.' },
  { icon: '🔒', title: 'Private & Secure', desc: 'Password-protect pages. Share links expire. Your data stays safe.' },
]

const steps = [
  { number: '01', icon: '⚡', title: 'Choose your style', desc: 'Quick Wish (30s), Personalized (2min), or Premium (5min). You pick.' },
  { number: '02', icon: '💝', title: 'Add your touch', desc: 'Name, photos, music, personal message — or skip everything and use gorgeous defaults.' },
  { number: '03', icon: '🔗', title: 'Share the magic', desc: 'Get a shareable link + QR code. Send on WhatsApp, email, anywhere.' },
]

const modes = [
  { icon: '⚡', name: 'Quick Wish', time: '~30 seconds', color: 'from-blue-500/20 to-violet-500/20', border: 'border-blue-500/20', badge: null, features: ['Instant generation', 'Premium defaults', 'All animations', 'Shareable link'] },
  { icon: '💝', name: 'Personalized', time: '~2 minutes', color: 'from-primary/20 to-secondary/20', border: 'border-primary/40', badge: 'Most Popular', features: ['Custom name & photo', 'Personal message', 'Theme selection', 'Music player'] },
  { icon: '👑', name: 'Premium Wish', time: '~5 minutes', color: 'from-accent/20 to-orange-500/20', border: 'border-accent/20', badge: null, features: ['Full photo gallery', 'Custom music/video', 'Guestbook wall', 'Scheduled reveal', 'Password protection'] },
]

const testimonials = [
  { name: 'Priya S.', role: 'Sent to her sister', message: 'She literally cried! The candle-blowing moment and the personal letter reveal were so touching. I never expected a website to feel so emotional.', avatar: '🌸' },
  { name: 'Marco T.', role: 'Anniversary surprise', message: 'My partner thought I had professionally made something. The 3D animations and opening sequence are insane. Way better than any e-card.', avatar: '🎭' },
  { name: 'Ananya R.', role: 'Friend group celebration', message: 'We all added our wishes to the guestbook and it became this amazing collective memory. She keeps replaying it even weeks later!', avatar: '🦋' },
]

/* ─── Component ─────────────────────────────────────────────── */
export default function LandingPage() {
  const howSection = useSection()
  const featSection = useSection()
  const modesSection = useSection()
  const testiSection = useSection()
  const ctaSection = useSection()

  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 pb-16">
        {/* Background */}
        <StarField starCount={180} className="opacity-70" />
        <div className="absolute inset-0 aurora pointer-events-none" />
        <div className="absolute inset-0 bg-mesh pointer-events-none" />

        {/* Floating particles */}
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
            style={{
              left: `${10 + (i * 5.5) % 80}%`,
              top: `${15 + (i * 7) % 65}%`,
              background: i % 3 === 0 ? '#FF6B9D' : i % 3 === 1 ? '#C44AFF' : '#FFD700',
            }}
            animate={{
              y: [0, -25, 0],
              x: [0, i % 2 === 0 ? 12 : -12, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.25 }}
          />
        ))}

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 text-primary text-sm font-semibold mb-8"
          >
            <span className="animate-pulse">✨</span> Create Magic in 60 Seconds
          </motion.div>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="font-display font-bold text-5xl sm:text-6xl md:text-7xl leading-[1.1] mb-6"
          >
            The World&apos;s Most{' '}
            <span className="gradient-text text-shadow-glow">Beautiful</span>
            <br />Birthday Celebration
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Create a cinematic birthday experience in under 60 seconds.
            Share with one link. Make someone feel truly, deeply special.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Link
              href="/create"
              className="btn-glow px-8 py-4 rounded-2xl font-bold text-lg text-white inline-flex items-center gap-2 group"
            >
              <span>Create Birthday</span>
              <span className="group-hover:rotate-12 transition-transform duration-300 text-xl">✨</span>
            </Link>
            <Link
              href="/create"
              className="px-8 py-4 rounded-2xl font-semibold text-lg glass border border-white/10 hover:border-primary/30 hover:bg-white/10 transition-all duration-300 inline-flex items-center gap-2 group"
            >
              See an Example
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="flex items-center justify-center gap-3 text-sm text-text-muted"
          >
            <div className="flex -space-x-2">
              {['🌸', '🦋', '🎭', '⭐', '🌟'].map((e, i) => (
                <div key={i} className="w-8 h-8 rounded-full glass border border-white/20 flex items-center justify-center text-xs">{e}</div>
              ))}
            </div>
            <span>Join <span className="text-white font-semibold">10,000+</span> people celebrating with CelebrateVerse</span>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted text-xs"
        >
          <span>Scroll to explore</span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1">
            <div className="w-1 h-2 rounded-full bg-primary animate-bounce" />
          </div>
        </motion.div>
      </section>

      {/* ══ HOW IT WORKS ══════════════════════════════════════ */}
      <section ref={howSection.ref} className="py-24 px-4 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={stagger} initial="hidden" animate={howSection.inView ? 'visible' : 'hidden'}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <span className="text-sm font-semibold text-primary uppercase tracking-widest">Simple Process</span>
              <h2 className="font-display font-bold text-4xl md:text-5xl mt-3 mb-4">Ready in 3 simple steps</h2>
              <p className="text-text-muted text-lg max-w-xl mx-auto">From idea to shareable link in under a minute. No account required.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connector line */}
              <div className="hidden md:block absolute top-16 left-[17%] right-[17%] h-px bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30" />

              {steps.map((step, i) => (
                <motion.div key={i} variants={fadeUp} custom={i}
                  className="relative flex flex-col items-center text-center p-6 glass rounded-2xl card-hover">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 flex items-center justify-center text-3xl mb-4 relative z-10">
                    {step.icon}
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-primary text-white text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-xl mb-2">{step.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ FEATURES ══════════════════════════════════════════ */}
      <section ref={featSection.ref} className="py-24 px-4 bg-mesh">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={stagger} initial="hidden" animate={featSection.inView ? 'visible' : 'hidden'}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <span className="text-sm font-semibold text-secondary uppercase tracking-widest">Features</span>
              <h2 className="font-display font-bold text-4xl md:text-5xl mt-3 mb-4">
                A celebration unlike <span className="gradient-text">anything they&apos;ve seen</span>
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <motion.div key={i} variants={fadeUp} custom={i}
                  className="glass rounded-2xl p-6 card-hover border border-white/[0.06] group">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
                  <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ MODES ══════════════════════════════════════════════ */}
      <section ref={modesSection.ref} className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={stagger} initial="hidden" animate={modesSection.inView ? 'visible' : 'hidden'}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <span className="text-sm font-semibold text-accent uppercase tracking-widest">Celebration Styles</span>
              <h2 className="font-display font-bold text-4xl md:text-5xl mt-3 mb-4">Choose your style</h2>
              <p className="text-text-muted text-lg">Every level creates something extraordinary.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {modes.map((mode, i) => (
                <motion.div key={i} variants={fadeUp} custom={i}
                  className={`relative rounded-2xl p-6 bg-gradient-to-br ${mode.color} border ${mode.border} card-hover`}>
                  {mode.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-primary text-white text-xs font-bold whitespace-nowrap">
                      {mode.badge}
                    </div>
                  )}
                  <div className="text-4xl mb-3">{mode.icon}</div>
                  <h3 className="font-display font-bold text-xl mb-1">{mode.name}</h3>
                  <span className="text-xs text-text-muted bg-white/10 px-2 py-0.5 rounded-full">{mode.time}</span>
                  <ul className="mt-4 space-y-2">
                    {mode.features.map((feat, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-text-muted">
                        <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <Link href="/create"
                    className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl glass border border-white/10 hover:border-primary/30 text-sm font-semibold transition-all group">
                    Get Started <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══════════════════════════════════════ */}
      <section ref={testiSection.ref} className="py-24 px-4 bg-mesh">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={stagger} initial="hidden" animate={testiSection.inView ? 'visible' : 'hidden'}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <span className="text-sm font-semibold text-primary uppercase tracking-widest">Testimonials</span>
              <h2 className="font-display font-bold text-4xl md:text-5xl mt-3 mb-4">Real moments of joy</h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div key={i} variants={fadeUp} custom={i}
                  className="glass rounded-2xl p-6 card-hover border border-white/[0.06]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-xl">{t.avatar}</div>
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-text-muted">{t.role}</p>
                    </div>
                  </div>
                  <div className="text-yellow-400 text-sm mb-3">★★★★★</div>
                  <p className="text-text-muted text-sm leading-relaxed italic">&ldquo;{t.message}&rdquo;</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ FINAL CTA ══════════════════════════════════════════ */}
      <section ref={ctaSection.ref} className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 aurora pointer-events-none" />
        <StarField starCount={80} className="opacity-40" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div variants={stagger} initial="hidden" animate={ctaSection.inView ? 'visible' : 'hidden'}>
            <motion.div variants={fadeUp} className="text-6xl mb-6">🎂</motion.div>
            <motion.h2 variants={fadeUp} className="font-display font-bold text-4xl md:text-5xl mb-6">
              Ready to make<br /><span className="gradient-text">someone&apos;s day?</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-text-muted text-lg mb-8">
              Free to use. No account needed. Works on every device.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link href="/create"
                className="btn-glow inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-xl text-white animate-pulse-glow">
                Create a Birthday Celebration ✨
              </Link>
            </motion.div>
            <motion.p variants={fadeUp} className="mt-6 text-xs text-text-muted">
              Takes less than 60 seconds • No credit card required
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════ */}
      <footer className="border-t border-white/[0.06] py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-muted">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎂</span>
            <span className="font-display font-bold text-white">CelebrateVerse</span>
            <span>— Make every birthday magical</span>
          </div>
          <div className="flex gap-6">
            <Link href="/create" className="hover:text-white transition-colors">Create</Link>
            <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
          </div>
          <p>© {new Date().getFullYear()} CelebrateVerse</p>
        </div>
      </footer>
    </div>
  )
}
