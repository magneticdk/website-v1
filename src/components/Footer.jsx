import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About</h4>
            <p>A comprehensive toolkit with resources to help you succeed.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#guides">Guides</a></li>
              <li><a href="#templates">Templates</a></li>
              <li><a href="#videos">Videos</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#community">Community</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Resource Toolkit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
