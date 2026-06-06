import { useState } from 'react'
import './ImageGallery.css'

type ImageGalleryProps = {
  images: string[]
  name: string
}

export default function ImageGallery({ images, name }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = images[activeIndex]

  if (!activeImage) {
    return <div className="gallery-placeholder" aria-label={`No images for ${name}`} />
  }

  return (
    <div className="gallery">
      <div className="gallery-main">
        <img src={activeImage} alt={name} />
      </div>
      {images.length > 1 ? (
        <div className="gallery-thumbs">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              className={index === activeIndex ? 'is-active' : undefined}
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1} of ${images.length}`}
            >
              <img src={image} alt="" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
