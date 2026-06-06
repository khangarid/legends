import { Link, useParams } from 'react-router-dom'
import CertificateBadges from '../components/CertificateBadges'
import ImageGallery from '../components/ImageGallery'
import { formatPrice, getItemById } from '../lib/catalog'
import { mn } from '../lib/mn'
import './ItemDetailPage.css'

export default function ItemDetailPage() {
  const { id } = useParams()
  const item = id ? getItemById(id) : undefined

  if (!item) {
    return (
      <div className="container detail-empty">
        <h1>{mn.item.notFound}</h1>
        <p>{mn.item.notFoundDescription}</p>
        <Link to="/">{mn.item.backToCatalog}</Link>
      </div>
    )
  }

  const price = formatPrice(item.price)

  return (
    <div className="detail-page">
      <div className="container detail-breadcrumb">
        <Link to="/">{mn.nav.catalog}</Link>
        <span>/</span>
        <span>{item.name}</span>
      </div>

      <div className="container detail-layout">
        <ImageGallery images={item.images} name={item.name} />

        <aside className="detail-panel">
          <p className="detail-category">{item.category}</p>
          <h1>{item.name}</h1>

          {item.auction ? (
            <p className="detail-auction">{mn.item.upForAuctionDetail}</p>
          ) : price ? (
            <p className="detail-price">{price}</p>
          ) : null}

          <p className="detail-description">
            {item.description || mn.item.defaultDescription}
          </p>
        </aside>
      </div>

      <div className="container detail-certificates">
        <CertificateBadges />
      </div>
    </div>
  )
}
