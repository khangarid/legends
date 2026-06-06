import { certificatePartners } from '../types/static'
import { mn } from '../lib/mn'
import './CertificateBadges.css'

const base = import.meta.env.BASE_URL

const partnerDescriptions = {
  psa: mn.certificates.partners.psa,
  beckett: mn.certificates.partners.beckett,
  jsa: mn.certificates.partners.jsa,
} as const

export default function CertificateBadges() {
  return (
    <section className="certificates">
      <div className="section-heading">
        <p className="eyebrow">{mn.certificates.eyebrow}</p>
        <h2>{mn.certificates.title}</h2>
        <p className="certificates-copy">{mn.certificates.copy}</p>
      </div>
      <div className="certificates-grid">
        {certificatePartners.map((partner) => (
          <a
            key={partner.id}
            href={partner.url}
            target="_blank"
            rel="noreferrer"
            className="certificate-card"
          >
            <img src={`${base}certificates/${partner.id}.svg`} alt={partner.name} />
            <div>
              <h3>{partner.name}</h3>
              <p>{partnerDescriptions[partner.id]}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
