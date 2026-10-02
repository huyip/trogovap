export const visibleRooms = (rooms) => rooms.filter((room) => room.status !== 'rented')

export const normalizeText = (value = '') => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .trim()

export const formatPrice = (price) => price == null ? 'Liên hệ' : `${new Intl.NumberFormat('vi-VN').format(price)}đ`

export const priceLabel = (price) => price >= 6000000 ? 'Trên 6 triệu' : price < 3000000 ? 'Dưới 3 triệu' : `${Math.floor(price / 1000000)}–${Math.ceil(price / 1000000)} triệu`

const matchesPriceRange = (price, filter) => {
  if (price == null) return false
  if (filter === 'under3') return price < 3000000
  if (filter === 'over6') return price >= 6000000
  const range = filter.match(/^(\d+)to(\d+)$/)
  return Boolean(range) && price >= Number(range[1]) * 1000000 && price < Number(range[2]) * 1000000
}

export const filterRooms = (rooms, filters) => {
  const query = normalizeText(filters.query)
  return visibleRooms(rooms).filter((room) => {
    const matchesQuery = !query || normalizeText(`${room.title} ${room.area} ${room.district} ${room.code}`).includes(query)
    const matchesDistrict = !filters.district || room.district === filters.district
    const matchesArea = !filters.area || room.area === filters.area
    const roomPrices = [room.price, ...(room.floors || []).map((floor) => floor.price)]
    const matchesPrice = !filters.price || roomPrices.some((price) => matchesPriceRange(price, filters.price))
    const matchesSize = !filters.size || (room.size != null && ((filters.size === 'under20' && room.size < 20) || (filters.size === '20to30' && room.size >= 20 && room.size <= 30) || (filters.size === '30to40' && room.size > 30 && room.size <= 40) || (filters.size === 'over40' && room.size > 40)))
    const matchesAmenities = filters.amenities.every((amenity) => room.amenities.includes(amenity))
    const matchesAvailability = !filters.availableNow || room.status === 'available'
    return matchesQuery && matchesDistrict && matchesArea && matchesPrice && matchesSize && matchesAmenities && matchesAvailability
  })
}

export const sortRooms = (rooms, sortBy) => [...rooms].sort((a, b) => {
  if ((sortBy === 'priceAsc' || sortBy === 'priceDesc') && (a.price == null || b.price == null)) return Number(a.price == null) - Number(b.price == null)
  if (sortBy === 'priceAsc') return a.price - b.price
  if (sortBy === 'priceDesc') return b.price - a.price
  if (sortBy === 'sizeDesc') return (b.size || 0) - (a.size || 0)
  if (sortBy === 'newest') return (b.createdAt || b.id) - (a.createdAt || a.id)
  return 0
})

export const getSimilarRooms = (rooms, current) => visibleRooms(rooms)
  .filter((room) => room.id !== current.id)
  .sort((a, b) => (Number(b.area === current.area) - Number(a.area === current.area)) || Math.abs(a.price - current.price) - Math.abs(b.price - current.price))
  .slice(0, 4)
