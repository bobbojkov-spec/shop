'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function useHeaderScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const header = document.querySelector('.site-header')
    if (!header) return

    // Header initial fade-in
    gsap.from(header, {
      y: -20,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
    })

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === 'body') trigger.kill()
      })
    }
  }, [])
}
