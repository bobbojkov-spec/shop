'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function useGSAPAnimation() {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const container = containerRef.current
    if (!container) return

    // Hero cards animation
    const heroSection = container.querySelector('.hero-feature-strip')
    const heroCards = heroSection?.querySelectorAll('.feature-card')
    if (heroCards && heroCards.length > 0) {
      gsap.from(heroCards, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: heroSection,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })
    }

    // Product cards animation
    const productSection = container.querySelector('.product-section')
    const productCards = productSection?.querySelectorAll('.product-card')
    if (productCards && productCards.length > 0) {
      gsap.from(productCards, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: productSection,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      })
    }

    // Designers section animation
    const designersSection = container.querySelector('.designers-section')
    const designersText = designersSection?.querySelector('.designers-text')
    const designersMedia = designersSection?.querySelector('.designers-media')
    if (designersText && designersMedia && designersSection) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: designersSection,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      })

      tl.from(designersText, {
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      }).from(
        designersMedia,
        {
          x: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.4'
      )
    }

    // Blog cards animation
    const blogSection = container.querySelector('.blog-preview')
    const blogCards = blogSection?.querySelectorAll('.blog-card')
    if (blogCards && blogCards.length > 0) {
      gsap.from(blogCards, {
        y: 30,
        opacity: 0,
        scale: 0.98,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: blogSection,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      })
    }

    // Workshop section animation
    const workshopSection = container.querySelector('.workshop-section')
    const workshopText = workshopSection?.querySelector('.workshop-text')
    const workshopThumbs = workshopSection?.querySelectorAll('.workshop-thumb')
    if (workshopText && workshopSection) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: workshopSection,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      })

      tl.from(workshopText, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      }).from(
        workshopThumbs || [],
        {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.1,
        },
        '-=0.3'
      )
    }

    // Gallery items animation
    const gallerySection = container.querySelector('.gallery-strip')
    const galleryItems = gallerySection?.querySelectorAll('.gallery-item')
    if (galleryItems && galleryItems.length > 0) {
      gsap.from(galleryItems, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: gallerySection,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return containerRef
}
