import { Activity, Menu } from 'lucide-react'

export default function Header() {
  return <header className="site-header">
    <div className="container header-inner">
      <a className="brand" href="#top"><span className="brand-mark"><Activity size={19} strokeWidth={2.4} /></span><span className="brand-name"><span>Nhịp đập</span><strong>Hồ Chí Minh<span className="brand-dot">.</span></strong></span></a>
      <button className="icon-button menu-button" aria-label="Mở menu"><Menu size={22} /></button>
    </div>
  </header>
}
