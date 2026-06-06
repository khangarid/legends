import { useMemo, useState } from 'react'
import {
  catalogItems,
  getCategories,
  getHeroItems,
  siteConfig,
} from '../lib/catalog'
import HeroShowcase from '../components/HeroShowcase'
import ItemCard from '../components/ItemCard'
import './HomePage.css'

export default function HomePage() {
  const categories = getCategories()
  const heroItems = getHeroItems()
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return catalogItems
    return catalogItems.filter((item) => item.category === activeCategory)
  }, [activeCategory])

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="container home-hero-inner">
          <div>
            <p className="eyebrow">Authenticated Memorabilia</p>
            <h1>{siteConfig.site_title || 'Legends Memorabilia'}</h1>
            <p className="home-hero-copy">
              {siteConfig.tagline ||
                'Browse curated sports and cultural artifacts, from featured auction pieces to catalog staples.'}
            </p>
          </div>
          <div className="home-hero-stats">
            <div>
              <strong>{catalogItems.length}</strong>
              <span>Items</span>
            </div>
            <div>
              <strong>{categories.length}</strong>
              <span>Categories</span>
            </div>
            <div>
              <strong>{heroItems.length}</strong>
              <span>Live Auctions</span>
            </div>
          </div>
        </div>
      </section>

      <HeroShowcase items={heroItems} />

      <section className="catalog-section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Full Catalog</p>
            <h2>Explore the collection</h2>
          </div>

          <div className="category-nav">
            <button
              type="button"
              className={activeCategory === 'All' ? 'is-active' : undefined}
              onClick={() => setActiveCategory('All')}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={activeCategory === category ? 'is-active' : undefined}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {filteredItems.length === 0 ? (
            <p className="empty-state">No items in this category yet.</p>
          ) : (
            <div className="catalog-grid">
              {filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
