import { ArrowUpRight, MapPin, Ruler } from 'lucide-react'
import { formatPrice } from '../utils/room'

export default function RoomCard({ room, onOpen }) {
  return <article className="room-card">
    <button className="room-image-wrap" onClick={() => onOpen(room)} aria-label={`Xem ${room.title}`}>
      <img src={room.images[0]} alt={room.title} loading="lazy" />
      {room.status === 'upcoming' && <span className="status-badge">Sắp trống</span>}
      <span className="image-count">{room.images.length} ảnh</span>
    </button>
    <div className="room-card-body">
      <div className="room-meta"><span><MapPin size={14} />{room.area}</span><span>{room.district}</span></div>
      <h3>{room.title}</h3>
      <div className="room-price">{formatPrice(room.price)} <small>/ tháng</small></div>
      <div className="room-size"><Ruler size={15} /> {room.size}m² <span className="dot-separator">•</span> {room.amenities.slice(0, 2).join(' • ')}</div>
      <button className="text-button" onClick={() => onOpen(room)}>Xem phòng <ArrowUpRight size={17} /></button>
    </div>
  </article>
}
