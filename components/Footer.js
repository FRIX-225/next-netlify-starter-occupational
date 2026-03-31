import { useEffect, useState } from 'react'
import styles from './Footer.module.css'

export default function Footer() {
  const [atBottom, setAtBottom] = useState(false)

  useEffect(() => {
    const checkAtBottom = () => {
      const scrollBottom = window.scrollY + window.innerHeight
      const pageHeight = document.documentElement.scrollHeight
      const nearBottomThreshold = 24
      setAtBottom(scrollBottom + nearBottomThreshold >= pageHeight)
    }

    checkAtBottom()
    window.addEventListener('scroll', checkAtBottom, { passive: true })
    window.addEventListener('resize', checkAtBottom)

    return () => {
      window.removeEventListener('scroll', checkAtBottom)
      window.removeEventListener('resize', checkAtBottom)
    }
  }, [])

  return (
    <footer className={`app-footer ${atBottom ? 'visible-footer' : 'hidden-footer'}`}>
      <p>© {new Date().getFullYear()} Comenius University. All rights reserved.</p>
      <p>Research survey platform • Privacy first • Secure data collection</p>
    </footer>
  )
}
