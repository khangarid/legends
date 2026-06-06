import { certificatePartners } from '../types/static'
import './CertificateBadges.css'

const base = import.meta.env.BASE_URL

export default function CertificateBadges() {
  return (
    <section className="certificates">
      <div className="section-heading">
        <p className="eyebrow">Authentication Standards</p>
        <h2>Trusted by the industry&apos;s leading graders</h2>
        <p className="certificates-copy">
          Every piece in our catalog is prepared to meet the standards of the three
          most recognized authentication services in memorabilia collecting.
        </p>
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
              <p>{partner.description}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
