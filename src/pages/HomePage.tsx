import { useMemo, useState } from 'react'
import {
  catalogItems,
  getCategories,
  getHeroItems,
  siteConfig,
} from '../lib/catalog'
import { ALL_CATEGORY, mn } from '../lib/mn'
import HeroShowcase from '../components/HeroShowcase'
import ItemCard from '../components/ItemCard'
import './HomePage.css'

export default function HomePage() {
  const categories = getCategories()
  const heroItems = getHeroItems()
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY)

  const filteredItems = useMemo(() => {
    if (activeCategory === ALL_CATEGORY) return catalogItems
    return catalogItems.filter((item) => item.category === activeCategory)
  }, [activeCategory])

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="container home-hero-inner">
          <div>
            <p className="eyebrow">{mn.home.eyebrow}</p>
            <h1>{siteConfig.site_title || mn.site.defaultTitle}</h1>
            <p className="home-hero-copy">
              {siteConfig.tagline || mn.site.defaultTagline}
            </p>
          </div>
          <div className="home-hero-stats">
            <div>
              <strong>{catalogItems.length}</strong>
              <span>{mn.home.items}</span>
            </div>
            <div>
              <strong>{categories.length}</strong>
              <span>{mn.home.categories}</span>
            </div>
            <div>
              <strong>{heroItems.length}</strong>
              <span>{mn.home.liveAuctions}</span>
            </div>
          </div>
        </div>
      </section>

      <HeroShowcase items={heroItems} />

      <section className="catalog-section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">{mn.home.fullCatalog}</p>
            <h2>{mn.home.exploreCollection}</h2>
          </div>

          <div className="category-nav">
            <button
              type="button"
              className={activeCategory === ALL_CATEGORY ? 'is-active' : undefined}
              onClick={() => setActiveCategory(ALL_CATEGORY)}
            >
              {mn.home.all}
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
            <p className="empty-state">{mn.home.emptyCategory}</p>
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
