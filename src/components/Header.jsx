import { Activity, Menu, X, ArrowUpRight } from 'lucide-react'
import { useState } from 'react'

export default function Header({ onFindRooms }) {
  const [open, setOpen] = useState(false)
  const go = (id) => {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }
  return <header className="site-header">
    <div className="container header-inner">
      <a className="brand" href="#top" onClick={() => setOpen(false)}><span className="brand-mark"><Activity size={19} strokeWidth={2.4} /></span><span className="brand-name">Nhịp đập <strong>HCM</strong><span className="brand-dot">.</span></span></a>
      <button className="icon-button menu-button" onClick={() => setOpen(!open)} aria-label="Mở menu">{open ? <X size={22} /> : <Menu size={22} />}</button>
      <nav className={`nav ${open ? 'is-open' : ''}`}>
        <button onClick={() => go('top')}>Trang chủ</button>
        <button onClick={() => { onFindRooms(); setOpen(false) }}>Tìm phòng</button>
        <button onClick={() => go('areas')}>Khu vực</button>
        <button onClick={() => go('contact')}>Liên hệ</button>
        <button className="button button-dark nav-cta" onClick={() => { onFindRooms(); setOpen(false) }}>Tìm phòng ngay <ArrowUpRight size={16} /></button>
      </nav>
    </div>
  </header>
}
