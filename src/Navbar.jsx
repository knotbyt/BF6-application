import './App.css'

function Navbar() {
  return (
    <div className="top-bar">
      <div className="brand">BF6 Clan</div>
      <nav className="navbar">
        <a href="#clans" className="nav-link">Clans</a>
        <a href="#about" className="nav-link">About</a>
      </nav>
    </div>
  )
}

export default Navbar
