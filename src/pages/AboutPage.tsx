import { siteConfig } from '../lib/catalog'
import { mn } from '../lib/mn'
import CertificateBadges from '../components/CertificateBadges'
import './AboutPage.css'

export default function AboutPage() {
  const title = siteConfig.about_title || mn.about.defaultTitle
  const body = siteConfig.about_body || mn.about.defaultBody

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <p className="eyebrow">{mn.about.ourStory}</p>
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
            <h2>{mn.about.contact}</h2>
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
