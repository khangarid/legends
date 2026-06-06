import { siteConfig } from '../lib/catalog'
import CertificateBadges from '../components/CertificateBadges'
import './AboutPage.css'

export default function AboutPage() {
  const title = siteConfig.about_title || 'About Legends Memorabilia'
  const body =
    siteConfig.about_body ||
    'Legends Memorabilia specializes in authenticated sports and cultural artifacts. Our catalog brings together rare pieces sourced with provenance, condition reporting, and industry-standard authentication in mind.'

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <p className="eyebrow">Our Story</p>
          <h1>{title}</h1>
          <p>{siteConfig.about_intro || siteConfig.tagline}</p>
        </div>
      </section>

      <section className="about-content">
        <div className="container about-grid">
          <div className="about-copy">
            {body.split('\n').map((paragraph: string) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <aside className="about-contact">
            <h2>Contact</h2>
            {siteConfig.address ? <p>{siteConfig.address}</p> : null}
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
            {siteConfig.hours ? <p>{siteConfig.hours}</p> : null}
          </aside>
        </div>
      </section>

      <section className="about-certificates">
        <div className="container">
          <CertificateBadges />
        </div>
      </section>
    </div>
  )
}
