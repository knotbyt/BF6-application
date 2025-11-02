import './App.css'

function Contact() {
  return (
    <div id="contact">
      <div className="contact-page">
        <h1 className="contact-title">Apply to Join</h1>
        <div className="application-form">
          <form className="clan-application">
            <div className="form-group">
              <label htmlFor="gamerTag">Gamer User:</label>
              <input type="text" id="gamerTag" name="gamerTag" placeholder="Enter your gamer user" />
            </div>
            <div className="form-group">
              <label htmlFor="preferredRole">Preferred Role:</label>
              <select id="preferredRole" name="preferredRole">
                <option value="">Select your role</option>
                <option value="assault">Assault</option>
                <option value="support">Support</option>
                <option value="recon">Recon</option>
                <option value="engineer">Engineer</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="platform">Platform:</label>
              <select id="platform" name="platform">
                <option value="">Select platform</option>
                <option value="pc">PC</option>
                <option value="xbox">Xbox</option>
                <option value="playstation">PlayStation</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="experience">BF6 Experience Level:</label>
              <select id="experience" name="experience">
                <option value="">Select experience</option>
                <option value="beginner">noob</option>
                <option value="intermediate">average</option>
                <option value="advanced">pro</option>
                <option value="veteran">pro-haxor</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="discord">Discord Username:</label>
              <input type="text" id="discord" name="discord" placeholder="YourDiscord#1234" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Why do you want to join? (Optional):</label>
              <textarea id="message" name="message" rows="4" placeholder="Tell us about yourself and why you want to join our clan..."></textarea>
            </div>
            <button type="submit" className="submit-application-btn">Submit Application</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact

