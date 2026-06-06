import { Link } from 'react-router-dom'
import { siteConfig } from '../lib/catalog'
import { mn } from '../lib/mn'
import './Footer.css'

export default function Footer() {
  const title = siteConfig.site_title || mn.site.defaultTitle

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <section>
          <h2>{title}</h2>
          <p>
            {siteConfig.footer_tagline ||
              siteConfig.tagline ||
              mn.site.defaultFooterTagline}
          </p>
        </section>

        <section>
          <h3>{mn.footer.visit}</h3>
          {siteConfig.address ? <p>{siteConfig.address}</p> : null}
          {siteConfig.hours ? <p>{siteConfig.hours}</p> : null}
        </section>

        <section>
          <h3>{mn.footer.contact}</h3>
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
          <h3>{mn.footer.explore}</h3>
          <p>
            <Link to="/about">{mn.footer.aboutCollection}</Link>
          </p>
        </section>
      </div>
      <div className="container footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} {title}. {mn.footer.rightsReserved}
        </p>
      </div>
    </footer>
  )
}
