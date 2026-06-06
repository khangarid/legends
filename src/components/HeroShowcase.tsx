import { Link } from 'react-router-dom'
import type { CatalogItem } from '../types/item'
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
          <p className="eyebrow">Featured Auctions</p>
          <h2>Hero pieces from the collection</h2>
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
                <span className="hero-card-badge">Up for Auction</span>
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
