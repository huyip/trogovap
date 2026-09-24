import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useRef, useState } from 'react'

export default function Gallery({ room, onClose }) {
  const [index, setIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [zoom, setZoom] = useState(1)
  const galleryRef = useRef(null)
  const pinchStartDistance = useRef(null)
  const pinchStartZoom = useRef(1)
  const distanceBetweenTouches = (touches) => Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY)
  const move = (step) => { setIndex((current) => (current + step + room.images.length) % room.images.length); setZoom(1) }
  const handleTouchStart = (event) => {
    if (event.touches.length === 2) {
      pinchStartDistance.current = distanceBetweenTouches(event.touches)
      pinchStartZoom.current = zoom
      setTouchStart(null)
      setDragging(false)
      return
    }
    setTouchStart(event.touches[0].clientX)
    setDragging(true)
  }
  const handleTouchMove = (event) => {
    if (event.touches.length === 2 && pinchStartDistance.current) {
      const scale = distanceBetweenTouches(event.touches) / pinchStartDistance.current
      setZoom(Math.min(3, Math.max(1, pinchStartZoom.current * scale)))
      return
    }
    if (touchStart === null) return
    setDragOffset(event.touches[0].clientX - touchStart)
  }
  const handleTouchEnd = (event) => {
    if (pinchStartDistance.current) {
      pinchStartDistance.current = null
      return
    }
    if (touchStart === null) return
    const distance = event.changedTouches[0].clientX - touchStart
    const width = galleryRef.current?.offsetWidth || 1
    if (Math.abs(distance) > width * 0.25) move(distance < 0 ? 1 : -1)
    setTouchStart(null)
    setDragOffset(0)
    setDragging(false)
  }
  return <div className="gallery">
    <div className="gallery-main" ref={galleryRef} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      <div className="gallery-track" style={{ transform: `translateX(calc(-${index * 100}% + ${dragOffset}px))`, transition: dragging ? 'none' : undefined }}>
        {room.images.map((src, imageIndex) => <img key={src} className={imageIndex === index && zoom > 1 ? 'is-zoomed' : ''} style={imageIndex === index ? { transform: `scale(${zoom})` } : undefined} src={src} alt={`${room.title} - ảnh ${imageIndex + 1}`} />)}
      </div>
      <button className="gallery-close icon-button" onClick={onClose} aria-label="Đóng"><X size={20} /></button>
      {room.images.length > 1 && <><button className="gallery-arrow gallery-prev" onClick={() => move(-1)} aria-label="Ảnh trước"><ChevronLeft /></button><button className="gallery-arrow gallery-next" onClick={() => move(1)} aria-label="Ảnh tiếp"><ChevronRight /></button></>}
      <span className="gallery-counter">{index + 1} / {room.images.length}</span>
    </div>
    <div className="gallery-thumbs">{room.images.map((src, thumbIndex) => <button key={src} className={thumbIndex === index ? 'active' : ''} onClick={() => { setIndex(thumbIndex); setZoom(1) }}><img src={src} alt="" loading="lazy" /></button>)}</div>
  </div>
}
