import { Link } from 'react-router-dom'
import type { CatalogItem } from '../types/item'
import { mn } from '../lib/mn'
import './HeroShowcase.css'

type HeroShowcaseProps = {
  items: CatalogItem[]
}

export default function HeroShowcase({ items }: HeroShowcaseProps) {
  if (items.length === 0) return null

  return (
    <section className="hero-showcase">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">{mn.hero.featuredAuctions}</p>
          <h2>{mn.hero.heroPieces}</h2>
        </div>
        <div className="hero-grid">
          {items.map((item) => (
            <Link key={item.id} to={`/item/${item.id}`} className="hero-card">
              <div className="hero-card-media">
                {item.images[0] ? (
                  <img src={item.images[0]} alt={item.name} />
                ) : (
                  <div className="hero-card-placeholder" />
                )}
                <span className="hero-card-badge">{mn.hero.upForAuction}</span>
              </div>
              <div className="hero-card-body">
                <p>{item.category}</p>
                <h3>{item.name}</h3>
                {item.description ? <p className="hero-card-copy">{item.description}</p> : null}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
