import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './Navbar'
import About from './About'
import Contact from './Contact'

function App() {
  const [currentPage, setCurrentPage] = useState('about')

  useEffect(() => {
    const hash = window.location.hash.slice(1) || 'about'
    setCurrentPage(hash)
    
    const handleHashChange = () => {
      const newHash = window.location.hash.slice(1) || 'about'
      setCurrentPage(newHash)
      const element = document.getElementById(newHash)
      if (element) {
        element.scrollIntoView()
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    
    const element = document.getElementById(hash)
    if (element) {
      element.scrollIntoView()
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return (
    <div>
      <Navbar />
      {currentPage === 'about' && <About />}
      {currentPage === 'contact' && <Contact />}
    </div>
  )
}

export default App
