import { useState, useEffect } from 'react'
import './App.css'

const currentUser = 'Knot'

function Clans({ onClanSelect }) {
  const [clans, setClans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadClans = async () => {
      try {
        const response = await fetch('/data/clans.json')
        if (response.ok) {
          const data = await response.json()
          setClans(data)
        } else {
          console.error('Failed to load clans.json')
          setClans([])
        }
      } catch (error) {
        console.error('Error loading clans:', error)
        setClans([])
      } finally {
        setLoading(false)
      }
    }

    loadClans()
    
    const interval = setInterval(loadClans, 2000)
    
    return () => clearInterval(interval)
  }, [])

  const reloadClans = async () => {
    try {
      const response = await fetch('/data/clans.json')
      if (response.ok) {
        const data = await response.json()
        setClans(data)
      }
    } catch (error) {
      console.error('Error reloading clans:', error)
    }
  }
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingClan, setEditingClan] = useState(null)
  const [newClan, setNewClan] = useState({
    name: '',
    tag: '',
    description: '',
    region: '',
    platform: '',
    color: '#4A9EFF'
  })

  const handleClanClick = (clan) => {
    onClanSelect(clan)
  }

  const handleEdit = (e, clan) => {
    e.stopPropagation()
    setEditingClan({ ...clan })
    setShowEditModal(true)
  }

  const handleDelete = async (e, clan) => {
    e.stopPropagation()
    if (!window.confirm(`Are you sure you want to delete "${clan.name}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/api/local/clans/${clan.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await reloadClans()
        alert(`Clan "${clan.name}" has been deleted.`)
      } else {
        const error = await response.json()
        alert(`Error deleting clan: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting clan:', error)
      alert('Error deleting clan. Make sure the server is running on port 5000.')
    }
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:5000/api/local/clans/${editingClan.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingClan)
      })

      if (response.ok) {
        await reloadClans()
        setShowEditModal(false)
        setEditingClan(null)
      } else {
        const error = await response.json()
        alert(`Error updating clan: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating clan:', error)
      alert('Error updating clan. Make sure the server is running on port 5000.')
    }
  }

  const handleAddClan = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/api/local/clans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newClan,
          owner: currentUser
        })
      })

      if (response.ok) {
        const newClanData = await response.json()
        await reloadClans()
        setNewClan({
          name: '',
          tag: '',
          description: '',
          region: '',
          platform: '',
          color: '#4A9EFF'
        })
        setShowAddModal(false)
        alert(`Clan "${newClanData.name}" created successfully! Knot has been added as the leader.`)
      } else {
        const error = await response.json()
        alert(`Error creating clan: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating clan:', error)
      alert('Error creating clan. Make sure the server is running on port 5000.\n\nTo start the server, run: npm start (in the server directory) or node server/index.js')
    }
  }

  if (loading) {
    return (
      <div id="clans" className="clans-page">
        <div className="clans-header">
          <h1 className="clans-title">BF6 Clans</h1>
          <p className="clans-subtitle">Loading clans...</p>
        </div>
      </div>
    )
  }

  return (
    <div id="clans" className="clans-page">
      <div className="clans-header">
        <h1 className="clans-title">BF6 Clans</h1>
        <p className="clans-subtitle">Browse and join competitive clans</p>
        <button className="add-clan-btn" onClick={() => setShowAddModal(true)}>
          <span className="plus-icon">+</span> Create Clan
        </button>
      </div>

      <div className="clans-list-container">
        <div className="clans-list">
          {clans.length === 0 ? (
            <p>No clans found</p>
          ) : (
            clans.map((clan) => (
            <div 
              key={clan.id} 
              className="clan-card"
              onClick={() => handleClanClick(clan)}
              style={{ '--clan-color': clan.color }}
            >
              <div className="clan-card-header">
                <div className="clan-avatar" style={{ backgroundColor: clan.color }}>
                  {clan.name.charAt(0)}
                </div>
                <div className="clan-info">
                  <h3 className="clan-name">
                    <span className="clan-tag">{clan.tag}</span> {clan.name}
                  </h3>
                  <p className="clan-owner">Led by {clan.owner}</p>
                </div>
                {clan.owner === currentUser && (
                  <>
                    <button 
                      className="edit-clan-btn"
                      onClick={(e) => handleEdit(e, clan)}
                    >
                      ✎ Edit
                    </button>
                    <button 
                      className="delete-clan-btn"
                      onClick={(e) => handleDelete(e, clan)}
                    >
                      🗑 Delete
                    </button>
                  </>
                )}
              </div>
              <p className="clan-description">{clan.description}</p>
              <div className="clan-stats">
                <div className="stat">
                  <span className="stat-value">{clan.members}</span>
                  <span className="stat-label">Members</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{clan.region}</span>
                  <span className="stat-label">Region</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{clan.platform}</span>
                  <span className="stat-label">Platform</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{clan.founded}</span>
                  <span className="stat-label">Founded</span>
                </div>
              </div>
              <div className="clan-card-footer">
                <span className="view-clan">View Clan →</span>
              </div>
            </div>
            ))
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Create New Clan</h2>
            <form onSubmit={handleAddClan} className="clan-form">
              <div className="form-group">
                <label>Clan Name</label>
                <input 
                  type="text" 
                  value={newClan.name}
                  onChange={e => setNewClan({...newClan, name: e.target.value})}
                  placeholder="Enter clan name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Clan Tag</label>
                <input 
                  type="text" 
                  value={newClan.tag}
                  onChange={e => setNewClan({...newClan, tag: e.target.value})}
                  placeholder="[TAG]"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={newClan.description}
                  onChange={e => setNewClan({...newClan, description: e.target.value})}
                  placeholder="Describe your clan..."
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Region</label>
                  <select 
                    value={newClan.region}
                    onChange={e => setNewClan({...newClan, region: e.target.value})}
                    required
                  >
                    <option value="">Select region</option>
                    <option value="NA East">NA East</option>
                    <option value="NA West">NA West</option>
                    <option value="EU West">EU West</option>
                    <option value="EU Central">EU Central</option>
                    <option value="Asia Pacific">Asia Pacific</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Platform</label>
                  <select 
                    value={newClan.platform}
                    onChange={e => setNewClan({...newClan, platform: e.target.value})}
                    required
                  >
                    <option value="">Select platform</option>
                    <option value="PC">PC</option>
                    <option value="Xbox">Xbox</option>
                    <option value="PlayStation">PlayStation</option>
                    <option value="Cross-play">Cross-play</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Clan Color</label>
                <input 
                  type="color" 
                  value={newClan.color}
                  onChange={e => setNewClan({...newClan, color: e.target.value})}
                  className="color-picker"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="submit-btn">Create Clan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingClan && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Edit Clan</h2>
            <form onSubmit={handleSaveEdit} className="clan-form">
              <div className="form-group">
                <label>Clan Name</label>
                <input 
                  type="text" 
                  value={editingClan.name}
                  onChange={e => setEditingClan({...editingClan, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Clan Tag</label>
                <input 
                  type="text" 
                  value={editingClan.tag}
                  onChange={e => setEditingClan({...editingClan, tag: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={editingClan.description}
                  onChange={e => setEditingClan({...editingClan, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Region</label>
                  <select 
                    value={editingClan.region}
                    onChange={e => setEditingClan({...editingClan, region: e.target.value})}
                    required
                  >
                    <option value="NA East">NA East</option>
                    <option value="NA West">NA West</option>
                    <option value="EU West">EU West</option>
                    <option value="EU Central">EU Central</option>
                    <option value="Asia Pacific">Asia Pacific</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Platform</label>
                  <select 
                    value={editingClan.platform}
                    onChange={e => setEditingClan({...editingClan, platform: e.target.value})}
                    required
                  >
                    <option value="PC">PC</option>
                    <option value="Xbox">Xbox</option>
                    <option value="PlayStation">PlayStation</option>
                    <option value="Cross-play">Cross-play</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Clan Color</label>
                <input 
                  type="color" 
                  value={editingClan.color}
                  onChange={e => setEditingClan({...editingClan, color: e.target.value})}
                  className="color-picker"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="submit-btn">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Clans

