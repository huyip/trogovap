import { Activity, Heart } from 'lucide-react'

export default function Header({ onShowFavorites, favoriteCount }) {
  return <header className="site-header">
    <div className="container header-inner">
      <a className="brand" href="#top"><span className="brand-mark"><Activity size={19} strokeWidth={2.4} /></span><span className="brand-name"><span>Nhịp đập</span><strong>Hồ Chí Minh<span className="brand-dot">.</span></strong></span></a>
      <button className="favorites-nav-button" type="button" onClick={onShowFavorites} aria-label={`Mở trang phòng yêu thích (${favoriteCount})`}>
        <Heart size={18} /><span>Yêu thích</span><span className="favorite-menu-count">{favoriteCount}</span>
      </button>
    </div>
  </header>
}
