import { ArrowLeft, ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'
import { districts } from '../data/rooms'

const prices = [['under3', 'Dưới 3 triệu'], ['3to4', '3–4 triệu'], ['4to5', '4–5 triệu'], ['5to6', '5–6 triệu'], ['over6', 'Trên 6 triệu']]
const quickPrices = [['3to4', '3xxx'], ['4to5', '4xxx'], ['5to6', '5xxx'], ['6to7', '6xxx'], ['7to8', '7xxx']]
const sizes = [['under20', 'Dưới 20m²'], ['20to30', '20–30m²'], ['30to40', '30–40m²'], ['over40', 'Trên 40m²']]
const amenities = ['Có gác', 'Máy lạnh', 'Tủ lạnh', 'Máy giặt', 'Máy giặt riêng', 'Ban công', 'Cửa sổ', '2 cửa sổ', 'Thoáng mát', 'Sân thượng phơi đồ', 'Thang máy', 'Giữ xe', 'Gửi xe miễn phí', 'Hầm xe', 'Có bảo vệ', 'Giường', 'Nệm', 'Tủ quần áo', 'Kệ bếp', 'Máy hút mùi', 'Bàn ghế', 'Giờ giấc tự do', 'Ra vào vân tay']

export default function SearchPanel({ filters, setFilters, count, sortBy, setSortBy }) {
  const [advanced, setAdvanced] = useState(false)
  const [locationOpen, setLocationOpen] = useState(false)
  const [locationMode, setLocationMode] = useState('district')
  const [locationQuery, setLocationQuery] = useState('')
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const clear = () => setFilters({ query: '', district: '', area: '', price: '', size: '', amenities: [], availableNow: false })
  const toggleAmenity = (item) => update('amenities', filters.amenities.includes(item) ? filters.amenities.filter((value) => value !== item) : [...filters.amenities, item])
  const openLocation = (mode) => { setLocationMode(mode); setLocationOpen(true); setLocationQuery('') }
  const chooseDistrict = (districtName) => { setFilters((current) => ({ ...current, district: districtName, area: '' })); setLocationOpen(false); setLocationQuery('') }
  const chooseArea = (area, districtName = filters.district) => { setFilters((current) => ({ ...current, district: districtName, area })); setLocationOpen(false); setLocationQuery('') }
  const selectedDistrict = districts.find((item) => item.name === filters.district)
  const visibleDistricts = districts.filter((item) => !locationQuery || item.name.toLowerCase().includes(locationQuery.toLowerCase()))
  const availableAreas = selectedDistrict
    ? selectedDistrict.areas.map((area) => ({ area, district: selectedDistrict.name }))
    : districts.flatMap((district) => district.areas.map((area) => ({ area, district: district.name })))
  const visibleAreas = availableAreas.filter(({ area, district }) => !locationQuery || `${area} ${district}`.toLowerCase().includes(locationQuery.toLowerCase()))
  return <section className="search-shell" id="find-rooms">
    <div className="search-row">
      <label className="search-input"><Search size={19} /><input aria-label="Tìm kiếm phòng" value={filters.query} onChange={(event) => update('query', event.target.value)} placeholder="Tìm theo khu vực..." /></label>
      <button className="select-field" type="button" onClick={() => openLocation('district')}><span>Quận</span><strong>{filters.district || 'Chọn quận'}</strong><ChevronDown size={16} /></button>
      <button className="select-field area-select" type="button" onClick={() => openLocation('area')}><span>Khu vực</span><strong>{filters.area || 'Chọn khu vực'}</strong><ChevronDown size={16} /></button>
      <button className="button button-accent search-submit" type="button" onClick={() => document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>TÌM</button>
      <button className="button button-accent filter-toggle" onClick={() => setAdvanced(!advanced)}><SlidersHorizontal size={17} /> Bộ lọc <span className="filter-count">{filters.amenities.length + Number(Boolean(filters.price)) + Number(Boolean(filters.size))}</span></button>
    </div>
    <div className="quick-price-filter" aria-label="Lọc nhanh theo mức giá">
      <strong>Mức giá:</strong>
      {quickPrices.map(([value, label]) => <button key={value} type="button" aria-pressed={filters.price === value} className={filters.price === value ? 'selected' : ''} onClick={() => update('price', filters.price === value ? '' : value)}>{label}</button>)}
    </div>
    {locationOpen && <div className="location-picker"><div className="location-picker-header"><button className="location-back" onClick={() => { setLocationOpen(false); setLocationQuery('') }}><ArrowLeft size={19} /></button><strong>{locationMode === 'district' ? 'Chọn quận' : `Chọn khu vực${selectedDistrict ? ` · ${selectedDistrict.name}` : ''}`}</strong></div><label className="location-search"><Search size={17} /><input autoFocus value={locationQuery} onChange={(event) => setLocationQuery(event.target.value)} placeholder={locationMode === 'district' ? 'Nhập tên quận' : 'Nhập tên khu vực'} /></label><div className="location-list">{locationMode === 'district' ? <><button className="location-option district-option" onClick={() => chooseDistrict('')}><span>Tất cả quận</span><small>{districts.length} quận</small></button>{visibleDistricts.map((item) => <button className="location-option district-option" key={item.name} onClick={() => chooseDistrict(item.name)}><span>{item.name}</span><small>Quận</small></button>)}</> : <><button className="location-option" onClick={() => chooseArea('', filters.district)}><span>Tất cả khu vực</span><small>{selectedDistrict ? `${selectedDistrict.areas.length} khu vực` : 'Mọi khu vực'}</small></button>{visibleAreas.map(({ area, district }) => <button className="location-option" key={`${district}-${area}`} onClick={() => chooseArea(area, district)}><span>{area}</span><small>{district}</small></button>)}</>}{((locationMode === 'district' && !visibleDistricts.length) || (locationMode === 'area' && !visibleAreas.length)) && <p className="location-empty">Không tìm thấy khu vực phù hợp.</p>}</div></div>}
    {advanced && <div className="advanced-filters">
      <FilterGroup title="Mức giá" options={prices} value={filters.price} onChange={(value) => update('price', value)} />
      <FilterGroup title="Diện tích" options={sizes} value={filters.size} onChange={(value) => update('size', value)} />
      <div className="filter-group"><div className="filter-heading">Tiện ích</div><label className="availability-toggle"><input type="checkbox" checked={filters.availableNow} onChange={(event) => update('availableNow', event.target.checked)} /> Có thể dọn vào ngay</label><div className="amenity-options">{amenities.map((item) => <button key={item} className={filters.amenities.includes(item) ? 'selected' : ''} onClick={() => toggleAmenity(item)}>{item}</button>)}</div></div>
    </div>}
    <div className="results-bar"><strong>{count} phòng phù hợp</strong><div className="results-actions"><label className="sort-select">Sắp xếp<select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="newest">Mới đăng</option><option value="priceAsc">Giá thấp đến cao</option><option value="priceDesc">Giá cao đến thấp</option><option value="sizeDesc">Diện tích lớn nhất</option></select></label><button className="clear-button" onClick={clear}><X size={14} /> Xóa bộ lọc</button></div></div>
  </section>
}

function FilterGroup({ title, options, value, onChange }) {
  return <div className="filter-group"><div className="filter-heading">{title}</div><div className="radio-options">{options.map(([key, label]) => <button key={key} className={value === key ? 'selected' : ''} onClick={() => onChange(value === key ? '' : key)}>{label}</button>)}</div></div>
}
