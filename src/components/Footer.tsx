import { Link } from 'react-router-dom'
import { siteConfig } from '../lib/catalog'
import './Footer.css'

export default function Footer() {
  const title = siteConfig.site_title || 'Legends Memorabilia'

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <section>
          <h2>{title}</h2>
          <p>{siteConfig.footer_tagline || siteConfig.tagline || 'Curated authenticated memorabilia.'}</p>
        </section>

        <section>
          <h3>Visit</h3>
          {siteConfig.address ? <p>{siteConfig.address}</p> : null}
          {siteConfig.hours ? <p>{siteConfig.hours}</p> : null}
        </section>

        <section>
          <h3>Contact</h3>
          {siteConfig.phone ? (
            <p>
              <a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}>{siteConfig.phone}</a>
            </p>
          ) : null}
          {siteConfig.email ? (
            <p>
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </p>
          ) : null}
        </section>

        <section>
          <h3>Explore</h3>
          <p>
            <Link to="/about">About the collection</Link>
          </p>
        </section>
      </div>
      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} {title}. All rights reserved.</p>
      </div>
    </footer>
  )
}
