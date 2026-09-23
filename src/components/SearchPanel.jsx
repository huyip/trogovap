import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'
import { districts } from '../data/rooms'

const prices = [['under3', 'Dưới 3 triệu'], ['3to4', '3–4 triệu'], ['4to5', '4–5 triệu'], ['5to6', '5–6 triệu'], ['over6', 'Trên 6 triệu']]
const sizes = [['under20', 'Dưới 20m²'], ['20to30', '20–30m²'], ['30to40', '30–40m²'], ['over40', 'Trên 40m²']]
const amenities = ['Có gác', 'Máy lạnh', 'Tủ lạnh', 'Máy giặt', 'Ban công', 'Cửa sổ', 'Thang máy', 'Giữ xe', 'Giờ giấc tự do', 'Ra vào vân tay']

export default function SearchPanel({ filters, setFilters, count }) {
  const [advanced, setAdvanced] = useState(false)
  const district = districts.find((item) => item.name === filters.district)
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const clear = () => setFilters({ query: '', district: 'Gò Vấp', area: '', price: '', size: '', amenities: [] })
  const toggleAmenity = (item) => update('amenities', filters.amenities.includes(item) ? filters.amenities.filter((value) => value !== item) : [...filters.amenities, item])
  return <section className="search-shell" id="find-rooms">
    <div className="search-row">
      <label className="search-input"><Search size={19} /><input value={filters.query} onChange={(event) => update('query', event.target.value)} placeholder="Tìm theo khu vực..." /></label>
      <label className="select-field"><span>Quận</span><select value={filters.district} onChange={(event) => update('district', event.target.value)}>{districts.map((item) => <option key={item.name}>{item.name}</option>)}</select><ChevronDown size={16} /></label>
      <label className="select-field area-select"><span>Khu vực</span><select value={filters.area} onChange={(event) => update('area', event.target.value)}><option value="">Tất cả khu vực</option>{(district?.areas || []).map((area) => <option key={area}>{area}</option>)}</select><ChevronDown size={16} /></label>
      <button className="button button-accent filter-toggle" onClick={() => setAdvanced(!advanced)}><SlidersHorizontal size={17} /> Bộ lọc <span className="filter-count">{filters.amenities.length + Number(Boolean(filters.price)) + Number(Boolean(filters.size))}</span></button>
    </div>
    {advanced && <div className="advanced-filters">
      <FilterGroup title="Mức giá" options={prices} value={filters.price} onChange={(value) => update('price', value)} />
      <FilterGroup title="Diện tích" options={sizes} value={filters.size} onChange={(value) => update('size', value)} />
      <div className="filter-group"><div className="filter-heading">Tiện ích</div><div className="amenity-options">{amenities.map((item) => <button key={item} className={filters.amenities.includes(item) ? 'selected' : ''} onClick={() => toggleAmenity(item)}>{item}</button>)}</div></div>
    </div>}
    <div className="results-bar"><strong>{count} phòng phù hợp</strong><button className="clear-button" onClick={clear}><X size={14} /> Xóa bộ lọc</button></div>
  </section>
}

function FilterGroup({ title, options, value, onChange }) {
  return <div className="filter-group"><div className="filter-heading">{title}</div><div className="radio-options">{options.map(([key, label]) => <button key={key} className={value === key ? 'selected' : ''} onClick={() => onChange(value === key ? '' : key)}>{label}</button>)}</div></div>
}
