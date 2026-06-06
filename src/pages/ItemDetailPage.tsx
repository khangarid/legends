import { Link, useParams } from 'react-router-dom'
import CertificateBadges from '../components/CertificateBadges'
import ImageGallery from '../components/ImageGallery'
import { formatPrice, getItemById } from '../lib/catalog'
import './ItemDetailPage.css'

export default function ItemDetailPage() {
  const { id } = useParams()
  const item = id ? getItemById(id) : undefined

  if (!item) {
    return (
      <div className="container detail-empty">
        <h1>Item not found</h1>
        <p>This catalog entry may have moved or is no longer available.</p>
        <Link to="/">Back to catalog</Link>
      </div>
    )
  }

  const price = formatPrice(item.price)

  return (
    <div className="detail-page">
      <div className="container detail-breadcrumb">
        <Link to="/">Catalog</Link>
        <span>/</span>
        <span>{item.name}</span>
      </div>

      <div className="container detail-layout">
        <ImageGallery images={item.images} name={item.name} />

        <aside className="detail-panel">
          <p className="detail-category">{item.category}</p>
          <h1>{item.name}</h1>

          {item.auction ? (
            <p className="detail-auction">Currently up for auction</p>
          ) : price ? (
            <p className="detail-price">{price}</p>
          ) : null}

          <p className="detail-description">
            {item.description ||
              'An authenticated memorabilia piece from the Legends collection. Contact us for provenance details and condition notes.'}
          </p>
        </aside>
      </div>

      <div className="container detail-certificates">
        <CertificateBadges />
      </div>
    </div>
  )
}
