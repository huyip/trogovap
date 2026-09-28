import { useEffect, useRef, useState } from 'react'
import { Check, Plus, X, ArrowUpRight } from 'lucide-react'
import { formatPrice, normalizeText } from '../utils/room'
import './RoomCompare.css'

const unknown = 'Chưa cập nhật'
export function comparisonGroups(rooms) {
  const costNames = [...new Set(['Điện', 'Nước', 'Dịch vụ', 'Gửi xe', ...rooms.flatMap(room => (room.costs || []).map(cost => cost.split(':')[0].trim()))])]
  const amenities = [...new Set(rooms.flatMap(room => room.amenities || []))]
  return [
    { title: 'Thông tin phòng', rows: [
      ['Giá thuê / tháng', room => formatPrice(room.price)],
      ['Diện tích', room => room.size ? room.size + ' m²' : unknown],
      ['Địa chỉ', room => room.address || [room.area, room.district].filter(Boolean).join(', ')],
      ['Tình trạng', room => room.status === 'available' ? 'Trống sẵn' : room.status === 'upcoming' ? 'Sắp trống' : 'Đã thuê'],
    ] },
    { title: 'Chi phí & dịch vụ', rows: costNames.map(name => [name, room => {
      const matches = (room.costs || []).filter(cost => normalizeText(cost.split(':')[0]) === normalizeText(name))
      return matches.length ? matches.map(cost => cost.includes(':') ? cost.slice(cost.indexOf(':') + 1).trim() : cost).join(' · ') : unknown
    }]) },
    { title: 'Tiện nghi & tiện ích', rows: amenities.map(name => [name, room => (room.amenities || []).includes(name) ? 'Có' : 'Chưa có thông tin']) },
    { title: 'Quy định lưu trú', rows: [['Quy định', room => room.rules?.length ? room.rules.join(' · ') : unknown]] },
  ]
}

export default function RoomCompare({ rooms, allRooms, onToggle, onClear, onOpen }) {
  const [open, setOpen] = useState(false)
  const [onlyDifferent, setOnlyDifferent] = useState(false)
  const [picking, setPicking] = useState(false)
  const [query, setQuery] = useState('')
  const dialog = useRef(null)
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.current.showModal()
    return () => {
      dialog.current?.close()
      document.body.style.overflow = previousOverflow
    }
  }, [open])
  const close = () => { setOpen(false); setPicking(false); setQuery('') }
  const groups = comparisonGroups(rooms).map(group => ({
    ...group,
    rows: group.rows.map(([label, getValue]) => ({ label, values: rooms.map(getValue) }))
      .filter(row => !onlyDifferent || new Set(row.values).size > 1),
  }))
  const candidates = allRooms.filter(room => room.status !== 'rented' && !rooms.some(selected => selected.id === room.id) && normalizeText(room.title + ' ' + room.code + ' ' + room.area).includes(normalizeText(query)))
  const showPicker = () => { setPicking(true); setQuery('') }
  return <>
    {rooms.length > 0 && <aside className="room-compare-tray" aria-label="Phòng đã chọn so sánh">
      <div className="compare-tray-heading"><strong>Đã chọn {rooms.length}/3 phòng</strong><button onClick={onClear}>Xóa tất cả</button></div>
      <div className="compare-tray-content">
        <div className="compare-tray-rooms">{rooms.map(room => <div className="compare-tray-room" key={room.id}>
          <img src={room.images?.[0]} alt="" /><div><strong>{room.title}</strong><span>{formatPrice(room.price)} / tháng</span></div>
          <button aria-label={'Bỏ ' + room.code} onClick={() => onToggle(room)}><X size={16} /></button>
        </div>)}</div>
        <button className="button button-accent" disabled={rooms.length < 2} onClick={() => setOpen(true)}>So sánh ngay ({rooms.length})</button>
      </div>
      <small>{rooms.length < 2 ? 'Chọn thêm 1 phòng để bắt đầu so sánh.' : rooms.length === 3 ? 'Đã đủ 3 phòng. Bỏ một phòng để chọn căn khác.' : 'Có thể chọn thêm 1 phòng để so sánh.'}</small>
    </aside>}
    <dialog ref={dialog} className="room-compare-dialog" aria-labelledby="compare-title" onCancel={close}>
      <header className="compare-dialog-heading"><div><p>CHỌN CĂN PHÙ HỢP VỚI BẠN</p><h2 id="compare-title">So sánh phòng</h2></div><button className="icon-button" aria-label="Đóng so sánh" onClick={close}><X /></button></header>
      <div className="compare-toolbar"><label><input type="checkbox" checked={onlyDifferent} disabled={rooms.length < 2} onChange={event => setOnlyDifferent(event.target.checked)} /> Chỉ xem điểm khác biệt</label><span>{rooms.length}/3 phòng{rooms.length === 3 ? ' · Vuốt ngang để xem đầy đủ' : ''}</span>{rooms.length < 3 && <button className="compare-toolbar-add" onClick={showPicker}><Plus size={16} /> Thêm phòng</button>}</div>
      {picking && rooms.length < 3 && <section className="compare-picker" aria-label="Thêm phòng so sánh">
        <div><input autoFocus aria-label="Tìm phòng để so sánh" placeholder="Tìm tên phòng, mã hoặc khu vực..." value={query} onChange={event => setQuery(event.target.value)} /><button className="icon-button" aria-label="Đóng danh sách thêm phòng" onClick={() => setPicking(false)}><X size={18} /></button></div>
        <div className="compare-picker-list">{candidates.map(room => <button key={room.id} onClick={() => { onToggle(room); setPicking(false) }}><img src={room.images?.[0]} alt="" /><span><strong>{room.title}</strong><small>{room.code} · {formatPrice(room.price)}</small></span><Plus size={18} /></button>)}{!candidates.length && <p>Không tìm thấy phòng phù hợp.</p>}</div>
      </section>}
      <div className="compare-table-scroll">
        <table className="room-compare-table" data-room-count={rooms.length}>
          <caption className="compare-sr-only">So sánh giá thuê, thông tin, chi phí và tiện nghi các phòng đã chọn</caption>
          <thead><tr><th scope="col" className="compare-label"><span>Thông tin so sánh</span><small>Chi phí giữ nguyên đơn vị theo từng phòng.</small></th>
            {rooms.map(room => <th scope="col" key={room.id}><div className="compare-room-summary">
              <button className="compare-remove" aria-label={'Bỏ ' + room.code + ' khỏi bảng'} onClick={() => onToggle(room)}><X size={17} /></button>
              <img src={room.images?.[0]} alt={room.title} /><small>{room.code}</small><h3>{room.title}</h3><strong>{formatPrice(room.price)} <small>/ tháng</small></strong>
              <button className="text-button" onClick={() => { close(); onOpen(room) }}>Xem phòng <ArrowUpRight size={15} /></button>
            </div></th>)}

          </tr></thead>
          {groups.filter(group => group.rows.length).map(group => <tbody key={group.title}>
            <tr className="compare-group"><th colSpan={1 + rooms.length}>{group.title}</th></tr>
            {group.rows.map(row => <tr key={row.label} className={new Set(row.values).size > 1 ? 'compare-different' : ''}><th scope="row">{row.label}</th>
              {row.values.map((value, index) => <td key={rooms[index].id}>{value === 'Có' ? <span className="compare-yes"><Check size={16} /> Có</span> : value}</td>)}

            </tr>)}
          </tbody>)}
        </table>
        {onlyDifferent && !groups.some(group => group.rows.length) && <p className="compare-no-difference">Chưa có điểm khác biệt trong thông tin đã cập nhật.</p>}
      </div>
      <footer className="compare-dialog-footer">Thông tin chưa cập nhật cần được xác nhận khi tư vấn.<button onClick={close}>Tiếp tục chọn phòng</button></footer>
    </dialog>
  </>
}