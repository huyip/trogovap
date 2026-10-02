import { Activity, Heart, Menu, X } from 'lucide-react'

export default function Header({ onShowFavorites, showFavorites, favoriteCount }) {
  return <header className="site-header">
    <div className="container header-inner">
      <a className="brand" href="#top"><span className="brand-mark"><Activity size={19} strokeWidth={2.4} /></span><span className="brand-name"><span>Nhịp đập</span><strong>Hồ Chí Minh<span className="brand-dot">.</span></strong></span></a>
      <button className="icon-button menu-button" type="button" onClick={onShowFavorites} aria-label={showFavorites ? 'Quay lại tất cả phòng' : `Xem phòng yêu thích (${favoriteCount})`} aria-pressed={showFavorites}>
        {showFavorites ? <X size={22} /> : <><Menu size={22} /><span className="favorite-menu-count"><Heart size={10} fill="currentColor" />{favoriteCount}</span></>}
      </button>
    </div>
  </header>
}
