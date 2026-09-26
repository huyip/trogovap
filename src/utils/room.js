export const visibleRooms = (rooms) => rooms.filter((room) => room.status !== 'rented')

export const normalizeText = (value = '') => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .trim()

export const formatPrice = (price) => `${new Intl.NumberFormat('vi-VN').format(price)}đ`

export const priceLabel = (price) => price >= 6000000 ? 'Trên 6 triệu' : price < 3000000 ? 'Dưới 3 triệu' : `${Math.floor(price / 1000000)}–${Math.ceil(price / 1000000)} triệu`

export const filterRooms = (rooms, filters) => {
  const query = normalizeText(filters.query)
  return visibleRooms(rooms).filter((room) => {
    const matchesQuery = !query || normalizeText(`${room.title} ${room.area} ${room.district} ${room.code}`).includes(query)
    const matchesDistrict = !filters.district || room.district === filters.district
    const matchesArea = !filters.area || room.area === filters.area
    const matchesPrice = !filters.price || (filters.price === 'under3' && room.price < 3000000) || (filters.price === '3to4' && room.price >= 3000000 && room.price < 4000000) || (filters.price === '4to5' && room.price >= 4000000 && room.price < 5000000) || (filters.price === '5to6' && room.price >= 5000000 && room.price < 6000000) || (filters.price === 'over6' && room.price >= 6000000)
    const matchesSize = !filters.size || (filters.size === 'under20' && room.size < 20) || (filters.size === '20to30' && room.size >= 20 && room.size <= 30) || (filters.size === '30to40' && room.size > 30 && room.size <= 40) || (filters.size === 'over40' && room.size > 40)
    const matchesAmenities = filters.amenities.every((amenity) => room.amenities.includes(amenity))
    const matchesAvailability = !filters.availableNow || room.status === 'available'
    return matchesQuery && matchesDistrict && matchesArea && matchesPrice && matchesSize && matchesAmenities && matchesAvailability
  })
}

export const sortRooms = (rooms, sortBy) => [...rooms].sort((a, b) => {
  if (sortBy === 'priceAsc') return a.price - b.price
  if (sortBy === 'priceDesc') return b.price - a.price
  if (sortBy === 'sizeDesc') return b.size - a.size
  if (sortBy === 'newest') return (b.createdAt || b.id) - (a.createdAt || a.id)
  return 0
})

export const getSimilarRooms = (rooms, current) => visibleRooms(rooms)
  .filter((room) => room.id !== current.id)
  .sort((a, b) => (Number(b.area === current.area) - Number(a.area === current.area)) || Math.abs(a.price - current.price) - Math.abs(b.price - current.price))
  .slice(0, 4)
