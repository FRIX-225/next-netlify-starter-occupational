import '@styles/globals.css'
import { useEffect } from 'react'

function Application({ Component, pageProps }) {
  useEffect(() => {
    const updateTheme = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.classList.toggle('dark', isDark)
    }
    
    updateTheme()
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme)
    
    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', updateTheme)
    }
  }, [])
  
  return <Component {...pageProps} />
}

export default Application
