import { ArrowUpRight, Heart, MapPin, Ruler } from 'lucide-react'
import { formatPrice } from '../utils/room'

export default function RoomCard({ room, onOpen, isFavorite, onToggleFavorite, isCompared, onToggleCompare }) {
  return <article className="room-card">
       <div className="room-image-wrap" onClick={() => onOpen(room)} role="button" tabIndex="0" onKeyDown={(event) => event.key === 'Enter' && onOpen(room)} aria-label={`Xem ${room.title}`}>
      <img src={room.images[0]} alt={room.title} loading="lazy" />
      <button className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`} onClick={(event) => { event.stopPropagation(); onToggleFavorite(room.id) }} aria-label={isFavorite ? 'Bỏ yêu thích' : 'Lưu phòng yêu thích'}><Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} /></button>
      {room.status === 'upcoming' && <span className="status-badge">Sắp trống</span>}
      <span className="image-count">{room.images.length} ảnh</span>
       </div>
    <div className="room-card-body">
      <div className="room-meta"><span><MapPin size={14} />{room.area}</span><span>{room.district}</span></div>
      <h3>{room.title}</h3>
      <div className="room-price">{formatPrice(room.price)} <small>/ tháng</small></div>
      <div className="room-size"><Ruler size={15} /> {room.size}m² <span className="dot-separator">•</span> {room.amenities.slice(0, 2).join(' • ')}</div>
      <div className="room-card-actions"><button className={`compare-button ${isCompared ? 'selected' : ''}`} onClick={() => onToggleCompare(room)}>{isCompared ? 'Đã chọn' : 'So sánh'}</button><button className="text-button" onClick={() => onOpen(room)}>Xem phòng <ArrowUpRight size={17} /></button></div>
    </div>
  </article>
}
