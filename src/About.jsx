import './App.css'
import unnamedImage from './assets/unnamed.jpg'
import battlefieldBg from './assets/battlefield-6-open-beta-details-labs-feedback-01.png'
import { useEffect, useRef } from 'react'
import Typed from 'typed.js'
import roles from './roles'

function About() {
  const typedElement = useRef(null)
  const aboutRef = useRef(null)

  useEffect(() => {
    const typed = new Typed(typedElement.current, {
      strings: roles,
      typeSpeed: 100,
      backSpeed: 50,
      loop: true
    })

    return () => {
      typed.destroy()
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!aboutRef.current) return
      
      const rect = aboutRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 100
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 100
      
      const bgElement = aboutRef.current.querySelector('.about-background')
      if (bgElement) {
        const moveX = x * 0.3
        const moveY = y * 0.3
        bgElement.style.transform = `translate(${moveX}%, ${moveY}%) scale(1.1)`
      }

    }

    const aboutElement = aboutRef.current
    if (aboutElement) {
      aboutElement.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      if (aboutElement) {
        aboutElement.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [])

  return (
    <div id="about" ref={aboutRef}>
      <div className="about-background" style={{ backgroundImage: `url(${battlefieldBg})` }}></div>
      <div className="about-intro">
        <div className="about-intro-text">
          <span className="greeting-text">Welcome Soldier,</span> 
          <br/>
          <span className="name-text">I'm Knot</span>
          <br/>
          Clan Leader & <span ref={typedElement} className="typed-text"></span>
          <br/>
          <button className="download-cv-btn" onClick={() => window.location.hash = '#contact'}>
            Join Our Clan
          </button>
          <br/> 
     
        </div>
        <div className="image-glow-wrapper">
          <img src={unnamedImage} alt="Clan Leader Knot" className="about-intro-image" />
        </div>
      </div>
      <div className="about-description-box">
        <h2 className="description-title">About Our Clan</h2>
        <p className="description-text">
          We are a competitive Battlefield 6 clan looking for dedicated players who want to dominate the battlefield together. 
          Led by Knot, we focus on tactical gameplay, teamwork, and having fun while securing victories. Whether you're an 
          experienced veteran or new to BF6, if you're committed to playing as a team, we want you.
        </p>
        <h3 className="description-subtitle">What We Offer</h3>
        <p className="description-text">
          Regular squad sessions, competitive matches, strategic training, and a tight-knit community of players who 
          support each other both in-game and out. We value communication, skill development, and most importantly - 
          PTFO (Play The Fucking Objective). Join us if you're ready to be part of a winning team.
        </p>
      </div>
    </div>
  )
}

export default About

