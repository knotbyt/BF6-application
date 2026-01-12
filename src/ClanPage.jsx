import { useState, useEffect } from 'react'
import './App.css'

function ClanPage({ clan, onBack, onApply }) {
  const [applicationStatus, setApplicationStatus] = useState('not_applied') // 'not_applied', 'pending'
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [clanData, setClanData] = useState(clan)
  const [members, setMembers] = useState([])
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load clan data from local JSON file
    const fetchClanData = async () => {
      if (!clan || !clan.id) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/data/clans.json')
        if (response.ok) {
          const clans = await response.json()
          const foundClan = clans.find(c => c.id === clan.id || c.name === clan.name)
          if (foundClan) {
            setClanData(foundClan)
            setMembers(foundClan.memberList || [])
            setActivity(foundClan.activity || [])
          } else {
            // Use the passed clan data as fallback
            setMembers(clan.memberList || [])
            setActivity(clan.activity || [])
          }
        } else {
          // If file fails, use the passed clan data
          setMembers(clan.memberList || [])
          setActivity(clan.activity || [])
        }
      } catch (error) {
        console.error('Error fetching clan data:', error)
        // If file fails, use the passed clan data
        setMembers(clan.memberList || [])
        setActivity(clan.activity || [])
      } finally {
        setLoading(false)
      }
    }

    fetchClanData()
    
    // Set up interval to reload data every 2 seconds (to see updates)
    const interval = setInterval(fetchClanData, 2000)
    
    return () => clearInterval(interval)
  }, [clan])

  if (!clan) return null

  // Use clanData if available, otherwise fall back to clan prop
  const displayClan = clanData || clan

  const handleApply = () => {
    setApplicationStatus('pending')
  }

  const handleMessageLeader = () => {
    setShowMessageModal(true)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    // Here you would typically send the message to the leader
    // For now, we'll just show an alert and close the modal
    alert(`Message sent to ${displayClan.owner}!`)
    setMessageText('')
    setShowMessageModal(false)
  }

  // Get member list - use API data if available, otherwise show owner only
  const displayMembers = members.length > 0 
    ? members 
    : [{ username: displayClan.owner, role: 'Leader' }]

  // Get activity list - use API data if available, otherwise show empty
  const displayActivity = activity.length > 0 ? activity : []

  return (
    <div id="clan-page" className="clan-page">
      <button className="back-btn" onClick={onBack}>
        ← Back to Clans
      </button>
      
      <div className="clan-page-header" style={{ '--clan-color': displayClan.color }}>
        <div className="clan-page-avatar" style={{ backgroundColor: displayClan.color }}>
          {displayClan.name.charAt(0)}
        </div>
        <div className="clan-page-title">
          <h1>
            <span className="clan-page-tag">{displayClan.tag}</span> {displayClan.name}
          </h1>
          <p className="clan-page-leader">Led by <strong>{displayClan.owner}</strong></p>
        </div>
      </div>

      <div className="clan-page-content">
        <div className="clan-page-main">
          <section className="clan-section">
            <h2 className="section-title">About</h2>
            <p className="clan-about-text">{clan.description}</p>
          </section>

          <section className="clan-section">
            <h2 className="section-title">Clan Info</h2>
            <div className="clan-info-grid">
              <div className="info-card">
                <div className="info-icon">👥</div>
                <div className="info-details">
                  <span className="info-value">{displayClan.members || displayMembers.length}</span>
                  <span className="info-label">Active Members</span>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">🌍</div>
                <div className="info-details">
                  <span className="info-value">{displayClan.region}</span>
                  <span className="info-label">Region</span>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">🎮</div>
                <div className="info-details">
                  <span className="info-value">{displayClan.platform}</span>
                  <span className="info-label">Platform</span>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">📅</div>
                <div className="info-details">
                  <span className="info-value">{displayClan.founded}</span>
                  <span className="info-label">Founded</span>
                </div>
              </div>
            </div>
          </section>

          <section className="clan-section">
            <h2 className="section-title">Recent Activity</h2>
            <div className="activity-feed">
              {loading ? (
                <div className="activity-item">
                  <div className="activity-content">
                    <p>Loading activity...</p>
                  </div>
                </div>
              ) : displayActivity.length > 0 ? (
                displayActivity.map((act, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-dot" style={{ backgroundColor: displayClan.color }}></div>
                    <div className="activity-content">
                      <p><strong>{act.type === 'member_joined' ? 'New Member' : act.type === 'member_left' ? 'Member Left' : act.type === 'match_victory' ? 'Match Victory' : act.type === 'tournament_win' ? 'Tournament Win' : act.type === 'squad_session' ? 'Squad Session' : 'Activity'}</strong> - {act.message}</p>
                      <span className="activity-time">{act.timeAgo || 'Recently'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="activity-item">
                  <div className="activity-content">
                    <p>No recent activity</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="clan-page-sidebar">
          <div className="sidebar-section">
            <h3>Quick Actions</h3>
            <button 
              className="action-btn primary" 
              style={{ backgroundColor: applicationStatus === 'pending' ? '#999' : displayClan.color }} 
              onClick={handleApply}
              disabled={applicationStatus === 'pending'}
            >
              {applicationStatus === 'pending' ? 'Pending' : 'Apply to Join'}
            </button>
            <button className="action-btn secondary" onClick={handleMessageLeader}>
              Message Leader
            </button>
          </div>

          <div className="sidebar-section">
            <h3>Top Members</h3>
            <div className="member-list">
              {loading ? (
                <div className="member-item">
                  <div className="member-info">
                    <span className="member-name">Loading...</span>
                  </div>
                </div>
              ) : (
                displayMembers.slice(0, 10).map((member, index) => (
                  <div key={member.id || index} className="member-item">
                    <div className="member-avatar" style={{ backgroundColor: displayClan.color }}>
                      {member.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="member-info">
                      <span className="member-name">{member.username}</span>
                      <span className="member-role">{member.role}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Clan Stats</h3>
            <div className="stats-list">
              <div className="stat-row">
                <span className="stat-name">Win Rate</span>
                <span className="stat-val">72%</span>
              </div>
              <div className="stat-row">
                <span className="stat-name">Matches Played</span>
                <span className="stat-val">1,247</span>
              </div>
              <div className="stat-row">
                <span className="stat-name">Tournament Wins</span>
                <span className="stat-val">8</span>
              </div>
              <div className="stat-row">
                <span className="stat-name">Ranking</span>
                <span className="stat-val">#42</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {showMessageModal && (
        <div className="modal-overlay" onClick={() => setShowMessageModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Message {displayClan.owner}</h2>
            <form onSubmit={handleSendMessage} className="clan-form">
              <div className="form-group">
                <label>Message</label>
                <textarea 
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  placeholder={`Send a message to ${displayClan.owner}...`}
                  rows="6"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowMessageModal(false)}>Cancel</button>
                <button type="submit" className="submit-btn">Send Message</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClanPage

