import { Link } from 'react-router-dom'
import type { CatalogItem } from '../types/item'
import { formatPrice } from '../lib/catalog'
import { mn } from '../lib/mn'
import './ItemCard.css'

type ItemCardProps = {
  item: CatalogItem
  featured?: boolean
}

function ItemImage({ item }: { item: CatalogItem }) {
  if (item.images[0]) {
    return <img src={item.images[0]} alt={item.name} loading="lazy" />
  }

  return <div className="item-card-placeholder" aria-hidden="true" />
}

export default function ItemCard({ item, featured = false }: ItemCardProps) {
  const price = formatPrice(item.price)

  return (
    <Link to={`/item/${item.id}`} className={`item-card ${featured ? 'item-card--featured' : ''}`}>
      <div className="item-card-media">
        <ItemImage item={item} />
        {item.auction ? <span className="item-card-badge">{mn.item.upForAuction}</span> : null}
      </div>
      <div className="item-card-body">
        <p className="item-card-category">{item.category}</p>
        <h3>{item.name}</h3>
        {!item.auction && price ? <p className="item-card-price">{price}</p> : null}
      </div>
    </Link>
  )
}
