import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './Navbar'
import About from './About'
import Contact from './Contact'
import Clans from './Clans'
import ClanPage from './ClanPage'

function App() {
  const [currentPage, setCurrentPage] = useState('clans')
  const [selectedClan, setSelectedClan] = useState(null)

  useEffect(() => {
    const hash = window.location.hash.slice(1) || 'clans'
    setCurrentPage(hash)
    
    const handleHashChange = () => {
      const newHash = window.location.hash.slice(1) || 'about'
      setCurrentPage(newHash)
      // Reset selected clan when navigating away from clan-page
      if (newHash !== 'clan-page') {
        setSelectedClan(null)
      }
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

  const handleClanSelect = (clan) => {
    setSelectedClan(clan)
    window.location.hash = '#clan-page'
    setCurrentPage('clan-page')
  }

  const handleBackToClans = () => {
    setSelectedClan(null)
    window.location.hash = '#clans'
    setCurrentPage('clans')
  }

  const handleBackToClanPage = () => {
    window.location.hash = '#clan-page'
    setCurrentPage('clan-page')
  }

  const handleApplyToClan = () => {
    window.location.hash = '#apply'
    setCurrentPage('apply')
  }

  return (
    <div>
      <Navbar />
      {currentPage === 'about' && <About />}
      {currentPage === 'clans' && <Clans onClanSelect={handleClanSelect} />}
      {currentPage === 'clan-page' && selectedClan && (
        <ClanPage clan={selectedClan} onBack={handleBackToClans} onApply={handleApplyToClan} />
      )}
      {currentPage === 'apply' && selectedClan && (
        <Contact clan={selectedClan} onBack={handleBackToClanPage} />
      )}
    </div>
  )
}

export default App
