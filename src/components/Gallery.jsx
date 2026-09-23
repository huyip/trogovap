import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useState } from 'react'

export default function Gallery({ room, onClose }) {
  const [index, setIndex] = useState(0)
  const move = (step) => setIndex((current) => (current + step + room.images.length) % room.images.length)
  return <div className="gallery">
    <div className="gallery-main">
      <img src={room.images[index]} alt={`${room.title} - ảnh ${index + 1}`} />
      <button className="gallery-close icon-button" onClick={onClose} aria-label="Đóng"><X size={20} /></button>
      {room.images.length > 1 && <><button className="gallery-arrow gallery-prev" onClick={() => move(-1)} aria-label="Ảnh trước"><ChevronLeft /></button><button className="gallery-arrow gallery-next" onClick={() => move(1)} aria-label="Ảnh tiếp"><ChevronRight /></button></>}
      <span className="gallery-counter">{index + 1} / {room.images.length}</span>
    </div>
    <div className="gallery-thumbs">{room.images.map((src, thumbIndex) => <button key={src} className={thumbIndex === index ? 'active' : ''} onClick={() => setIndex(thumbIndex)}><img src={src} alt="" loading="lazy" /></button>)}</div>
  </div>
}
