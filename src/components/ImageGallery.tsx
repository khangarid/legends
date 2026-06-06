import { useState } from 'react'
import { mn } from '../lib/mn'
import './ImageGallery.css'

type ImageGalleryProps = {
  images: string[]
  name: string
}

export default function ImageGallery({ images, name }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = images[activeIndex]

  if (!activeImage) {
    return (
      <div
        className="gallery-placeholder"
        aria-label={mn.item.noImages(name)}
      />
    )
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
              aria-label={mn.item.viewImage(index + 1, images.length)}
            >
              <img src={image} alt="" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
