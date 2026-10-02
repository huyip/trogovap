import { ArrowLeft, Heart } from 'lucide-react'
import RoomCard from './RoomCard'

export default function FavoritesPage({ rooms, onBack, onOpen, favorites, onToggleFavorite, compareIds, onToggleCompare }) {
  return <>
    <header className="site-header">
      <div className="container header-inner">
        <div className="brand">
          <span className="brand-mark">Ở</span>
          <span className="brand-name"><span>Nhịp đập</span><strong>Hồ Chí Minh<span className="brand-dot">.</span></strong></span>
        </div>
        <button className="back-link favorites-back" type="button" onClick={onBack}><ArrowLeft size={17} /> Tìm phòng</button>
      </div>
    </header>
    <main className="container favorites-page" id="top">
      <div className="favorites-page-heading">
        <div>
          <p className="eyebrow"><Heart size={15} /> DANH SÁCH ĐÃ LƯU</p>
          <h1>Phòng yêu thích</h1>
          <p>Các phòng bạn đã lưu để xem lại sau.</p>
        </div>
        <span className="favorites-page-count">{rooms.length} phòng đã lưu</span>
      </div>
      {rooms.length ? <div className="room-grid">
        {rooms.map((room) => <RoomCard key={room.id} room={room} onOpen={onOpen} isFavorite={favorites.includes(room.id)} onToggleFavorite={onToggleFavorite} isCompared={compareIds.includes(room.id)} onToggleCompare={onToggleCompare} />)}
      </div> : <section className="favorites-empty">
        <span className="favorites-empty-icon"><Heart size={24} /></span>
        <h2>Chưa có phòng yêu thích</h2>
        <p>Chạm vào biểu tượng trái tim trên phòng để lưu lại tại đây.</p>
        <button className="button button-accent" type="button" onClick={onBack}>Khám phá phòng</button>
      </section>}
    </main>
  </>
}
