import { useEffect, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Check,
  ChevronRight,
  Heart,
  MessageCircle,
  Phone,
  Share2,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import Header from "./components/Header";
import RoomCard from "./components/RoomCard";
import Gallery from "./components/Gallery";
import SearchPanel from "./components/SearchPanel";
import FavoritesPage from "./components/FavoritesPage";
import RoomCompare from "./components/RoomCompare";
import AdminPage from "./components/AdminPage";
import { contactConfig } from "./config/contact";
import { districts, rooms as initialRooms, removedDemoCodes } from "./data/rooms";
import { filterRooms, formatPrice, getSimilarRooms, sortRooms } from "./utils/room";

const defaultFilters = {
  query: "",
  district: "",
  area: "",
  price: "",
  size: "",
  amenities: [],
  availableNow: false,
};
const appBase = import.meta.env.BASE_URL;
const appPath = (path = "") => `${appBase}${path}`;

export default function App() {
  const [rooms, setRooms] = useState(() => {
    try {
      const savedRooms = JSON.parse(localStorage.getItem("ogovap-rooms"));
      if (!Array.isArray(savedRooms)) return initialRooms;
      const savedIds = new Set(savedRooms.map((room) => room.id));
      const updatedSavedRooms = savedRooms.filter((room) => !removedDemoCodes.has(room.code)).map((room) => {
        if (room.code === "PHT202") return { ...room, title: "Studio - Ban công - Phạm Huy Thông" };
        if (room.code === "LDTHO503") return { ...room, title: "Duplex - Lê Đức Thọ" };
        if (room.code === "PVTRI307") {
          const currentListing = initialRooms.find((item) => item.code === room.code);
          return { ...room, title: "Duplex - Phan Văn Trị", images: currentListing.images };
        }
        if (room.code === "DQH080") {
          const currentListing = initialRooms.find((item) => item.code === room.code);
          return { ...room, title: currentListing.title, images: currentListing.images, video: currentListing.video, rules: currentListing.rules };
        }
        if (room.code === "DQH080P302") {
          const currentListing = initialRooms.find((item) => item.code === room.code);
          return { ...room, images: currentListing.images, video: currentListing.video };
        }
        if (room.code === "NVK029") {
          const currentListing = initialRooms.find((item) => item.code === room.code);
          return { ...room, images: currentListing.images, video: currentListing.video };
        }
        if (room.code === "DQH496P402") {
          const currentListing = initialRooms.find((item) => item.code === room.code);
          return { ...room, images: currentListing.images, video: currentListing.video };
        }
        if (room.code === "QT133P205") {
          const currentListing = initialRooms.find((item) => item.code === room.code);
          return { ...room, images: currentListing.images, video: currentListing.video };
        }
        if (room.code === "LDT145P201") {
          const currentListing = initialRooms.find((item) => item.code === room.code);
          return { ...room, images: currentListing.images, video: currentListing.video };
        }
        if (room.code === "LDT730130") {
          const currentListing = initialRooms.find((item) => item.code === room.code);
          return { ...room, images: currentListing.images, video: currentListing.video };
        }
        if (room.code === "LVT401") {
          const currentListing = initialRooms.find((item) => item.code === room.code);
          return { ...room, ...currentListing };
        }
        if (room.code === "LDTHO523") {
          const currentListing = initialRooms.find((item) => item.code === room.code);
          return { ...room, ...currentListing };
        }
        if (room.code === "LDTHO107") {
          const currentListing = initialRooms.find((item) => item.code === room.code);
          return { ...room, ...currentListing };
        }
        if (room.code === "QT581") {
          const currentListing = initialRooms.find((item) => item.code === room.code);
          return { ...room, ...currentListing };
        }
        if (room.code === "NTS566" || room.code === "NTS566D" || room.code === "PVC102" || room.code === "TN050BC" || room.code === "TN050D73" || room.code === "DQH496" || room.code === "DQH496L4") {
          const currentListing = initialRooms.find((item) => item.code === room.code);
          return { ...room, images: currentListing.images };
        }
        if (room.code === "TN050") {
          const currentListing = initialRooms.find((item) => item.code === room.code);
          return { ...room, images: currentListing.images, floors: currentListing.floors, price: currentListing.price };
        }
        if (room.code === "VL120") {
          const currentListing = initialRooms.find((item) => item.code === room.code);
          return { ...room, images: currentListing.images, video: currentListing.video };
        }
        if (room.code === "VL120B") {
          const currentListing = initialRooms.find((item) => item.code === room.code);
          return { ...room, images: currentListing.images, video: currentListing.video };
        }
        if (room.code === "VL120C") {
          const currentListing = initialRooms.find((item) => item.code === room.code);
          return { ...room, images: currentListing.images, video: currentListing.video };
        }
        return room;
      });
      return [...initialRooms.filter((room) => !savedIds.has(room.id)), ...updatedSavedRooms].map((room) => ({ ...room, amenities: [...new Set([...(room.amenities || []), "Máy lạnh"])] }));
    } catch {
      return initialRooms;
    }
  });
  const [filters, setFilters] = useState(defaultFilters);
  const [sortBy, setSortBy] = useState("newest");
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("ogovap-favorites") || "[]"));
  const [favoritesPage, setFavoritesPage] = useState(() => window.location.pathname.replace(/\/+$/, "").endsWith("/yeu-thich"));
  const [compareIds, setCompareIds] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [admin, setAdmin] = useState(() => window.location.pathname.replace(/\/+$/, "").endsWith("/admin"));
  const [returnScrollY, setReturnScrollY] = useState(0);
  useEffect(
    () => localStorage.setItem("ogovap-rooms", JSON.stringify(rooms)),
    [rooms],
  );
  useEffect(() => localStorage.setItem("ogovap-favorites", JSON.stringify(favorites)), [favorites]);
  useEffect(() => {
    const syncRoute = () => {
      const path = window.location.pathname.replace(/\/+$/, "");
      const roomCode = path.match(/\/phong\/([^/]+)$/)?.[1];
      setSelectedRoom(roomCode ? rooms.find((room) => room.code === roomCode) || null : null);
      setAdmin(path.endsWith("/admin"));
      setFavoritesPage(path.endsWith("/yeu-thich"));
    };
    syncRoute();
    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, [rooms]);
  useEffect(() => {
    document.title = selectedRoom
      ? `${selectedRoom.code} | Ở Gò Vấp`
      : admin
        ? "Quản trị | Ở Gò Vấp"
        : favoritesPage
          ? "Phòng yêu thích | Ở Gò Vấp"
        : "Ở Gò Vấp | Tìm phòng trọ dễ hơn";
  }, [selectedRoom, admin, favoritesPage]);
  const filteredRooms = sortRooms(filterRooms(rooms, filters), sortBy);
  const toggleFavorite = (id) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const toggleCompare = (room) => setCompareIds((current) => current.includes(room.id) ? current.filter((id) => id !== room.id) : current.length >= 3 ? current : [...current, room.id]);
  const compareRooms = rooms.filter((room) => compareIds.includes(room.id));
  const favoriteRooms = favorites.map((id) => rooms.find((room) => room.id === id)).filter(Boolean);
  const shareRoom = async (room) => {
    const url = window.location.href;
    if (navigator.share) await navigator.share({ title: room.title, text: `${room.title} · ${formatPrice(room.price)}/tháng`, url });
    else await navigator.clipboard?.writeText(url);
  };
  const openRoom = (room) => {
    setReturnScrollY(window.scrollY);
    setSelectedRoom(room);
    window.history.pushState({}, "", appPath(`phong/${room.code}`));
    window.scrollTo({ top: 0 });
  };
  const backHome = () => {
    const previousScrollY = returnScrollY;
    setSelectedRoom(null);
    setAdmin(false);
    window.history.pushState({}, "", favoritesPage ? appPath("yeu-thich") : appPath());
    window.requestAnimationFrame(() => window.scrollTo({ top: previousScrollY }));
  };
  const goFavorites = () => {
    setSelectedRoom(null);
    setAdmin(false);
    setFavoritesPage(true);
    window.history.pushState({}, "", appPath("yeu-thich"));
    window.scrollTo({ top: 0 });
  };
  const backFromFavorites = () => {
    setFavoritesPage(false);
    window.history.pushState({}, "", appPath());
    window.scrollTo({ top: 0 });
  };
  const goAdmin = () => {
    setAdmin(true);
    setSelectedRoom(null);
    setFavoritesPage(false);
    window.history.pushState({}, "", appPath("admin"));
    window.scrollTo({ top: 0 });
  };
  if (admin)
    return <AdminPage rooms={rooms} setRooms={setRooms} onBack={backHome} />;
  if (selectedRoom)
    return <RoomDetail room={selectedRoom} rooms={rooms} onBack={backHome} onOpen={openRoom} isFavorite={favorites.includes(selectedRoom.id)} onToggleFavorite={toggleFavorite} onShare={shareRoom} />;
  if (favoritesPage)
    return <FavoritesPage rooms={favoriteRooms} favorites={favorites} onBack={backFromFavorites} onOpen={openRoom} onToggleFavorite={toggleFavorite} compareIds={compareIds} onToggleCompare={toggleCompare} />;
  return (
    <Home
      rooms={filteredRooms} allRooms={rooms}
      filters={filters}
      setFilters={setFilters}
      sortBy={sortBy}
      setSortBy={setSortBy}
      favorites={favorites}
      compareIds={compareIds}
      compareRooms={compareRooms}
      onClearCompare={() => setCompareIds([])}
      onToggleFavorite={toggleFavorite}
      onToggleCompare={toggleCompare}
      onOpen={openRoom}
      onShowFavorites={goFavorites}
      onFindRooms={() =>
        document
          .getElementById("find-rooms")
          ?.scrollIntoView({ behavior: "smooth" })
      }
      onAdmin={goAdmin}
    />
  );
}

function Home({ rooms, allRooms, filters, setFilters, sortBy, setSortBy, favorites, compareIds, compareRooms, onClearCompare, onToggleFavorite, onToggleCompare, onOpen, onFindRooms, onShowFavorites, onAdmin }) {
  const [areaFocus, setAreaFocus] = useState("Gò Vấp");
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const areas = districts.find((item) => item.name === areaFocus)?.areas || [];
  const suggestedRooms = rooms.slice(0, 4);
  const chooseArea = (area) => {
    setFilters((current) => ({ ...current, district: areaFocus, area }));
    onFindRooms();
  };
  const goToRooms = () =>
    document
      .getElementById("rooms")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  useEffect(() => {
    if (suggestedRooms.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setSuggestionIndex((current) => (current + 1) % suggestedRooms.length);
    }, 1800);
    return () => window.clearInterval(timer);
  }, [suggestedRooms.length]);
  return (
    <>
      <Header
        onFindRooms={onFindRooms}
        favoriteCount={favorites.length}
        onShowFavorites={onShowFavorites}
      />
      <main id="top">
        <section className="hero">
          <div className="hero-grid container">
            <div className="hero-copy">
              <p className="eyebrow">
                <Sparkles size={15} /> Chỗ ở tử tế cho người trẻ
              </p>
              <h1>
                <span className="hero-title-line">Tìm phòng trọ</span>{" "}
                <span className="hero-title-line">
                  <span className="hero-accent">phù hợp tại</span>
                </span>{" "}
                <span className="hero-title-line hero-location">
                  Thành phố <span className="hero-city">Hồ Chí Minh</span>
                </span>
              </h1>
              <p className="hero-subtitle">
                Phòng đẹp · Giá rõ ràng · Tìm nhanh theo khu vực
              </p>
              <button
                className="button button-accent hero-button"
                onClick={onFindRooms}
              >
                Tìm phòng ngay <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </section>
        <section className="area-section" id="areas">
          <div className="container">
            <div className="suggestion-header">
              <p className="eyebrow">Khám phá theo vị trí</p>
              <h2>
                Mỗi khu phố,
                <br />
                <em>một nhịp sống.</em>
              </h2>
              <p className="section-intro">
                Từ những con đường quen thuộc đến góc nhỏ gần trường, chọn nơi
                hợp với nhịp sống của bạn.
              </p>
            </div>
            <div className="suggestion-carousel">
              <div
                className="suggestion-track"
                style={{ transform: `translateX(-${suggestionIndex * 100}%)` }}
              >
                {suggestedRooms.map((room) => (
                  <button
                    className="suggestion-slide"
                    key={room.id}
                    onClick={goToRooms}
                  >
                    {room.images?.[0] ? <img src={room.images[0]} alt={room.title} /> : <span className="suggestion-image-placeholder">Ảnh phòng sẽ được cập nhật</span>}
                    <div className="suggestion-overlay">
                      <span>{room.area}</span>
                      <strong>{room.title}</strong>
                      <small>{formatPrice(room.price)} / tháng</small>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="suggestion-footer">
              <div className="suggestion-breadcrumbs">
                {districts.slice(0, 4).map((district) => (
                  <span key={district.name}>{district.name}</span>
                ))}
              </div>
              <button
                className="button button-accent suggestion-button"
                onClick={goToRooms}
              >
                Xem phòng <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </section>
        <section className="container search-section">
          <div className="section-kicker">
            <span>01</span>
            <span>Chọn nơi bạn muốn ở</span>
          </div>
          <SearchPanel
            filters={filters}
            setFilters={setFilters}
            count={rooms.length}
            priceRooms={allRooms}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </section>
        <section className="rooms-section container" id="rooms">
          <div className="section-heading rooms-heading">
            <div>
              <div className="section-kicker">
                <span>02</span>
                <span>Phòng đang chờ bạn</span>
              </div>
              <h2>
                Chọn một căn
                <br />
                <em>vừa ý.</em>
              </h2>
            </div>
            <span className="result-total">{rooms.length} kết quả</span>
          </div>
          {rooms.length ? (
            <div className="room-grid">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} onOpen={onOpen} isFavorite={favorites.includes(room.id)} onToggleFavorite={onToggleFavorite} isCompared={compareIds.includes(room.id)} onToggleCompare={onToggleCompare} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
          <RoomCompare rooms={compareRooms} allRooms={allRooms} onToggle={onToggleCompare} onClear={onClearCompare} onOpen={onOpen} />
        </section>
        <section className="contact-band" id="contact">
          <div className="container contact-inner">
            <div>
              <p className="eyebrow">Bạn chưa tìm thấy căn phù hợp?</p>
              <h2>
                Nhắn cho mình,
                <br />
                <em>mình tìm cùng bạn.</em>
              </h2>
            </div>
            <a
              className="button button-light"
              href={contactConfig.zalo}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={18} /> Nhắn tư vấn
            </a>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="container">
          <div>
            <a className="brand" href="#top">
              <span className="brand-mark"><Activity size={19} strokeWidth={2.4} /></span>
              <span className="brand-name"><span>Nhịp đập</span><strong>Hồ Chí Minh<span className="brand-dot">.</span></strong></span>
            </a>
            <p>
              Phòng trọ tử tế cho một
              <br />
              cuộc sống vừa vặn.
            </p>
          </div>
          <div className="footer-links">
            <a href={contactConfig.phoneHref}>
              <Phone size={15} /> {contactConfig.phone}
            </a>
            <a href={contactConfig.zalo} target="_blank" rel="noreferrer">
              <MessageCircle size={15} /> Zalo tư vấn
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}


function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-icon">⌂</div>
      <h3>Chưa tìm thấy phòng phù hợp.</h3>
      <p>Thử nới rộng bộ lọc hoặc nhắn để mình tìm giúp bạn.</p>
    </div>
  );
}

function RoomMap({ room }) {
  const address =
    room.address || `${room.area}, ${room.district}, Thành phố Hồ Chí Minh`;
  const mapQuery = encodeURIComponent(address);
  return (
    <div className="room-map-card">
          <div className="location-heading">
            <div>
              <p className="eyebrow">Vị trí phòng</p>
              <h2>Địa chỉ & bản đồ</h2>
              <p>{address}</p>
            </div>
            <a
              className="map-link"
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              target="_blank"
              rel="noreferrer"
            >
              Mở bản đồ <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="map-frame">
            <iframe
              title={`Bản đồ vị trí ${room.title}`}
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
    </div>
  );
}

function RoomDetail({ room, rooms, onBack, onOpen, isFavorite, onToggleFavorite, onShare }) {
  const [floorSelection, setFloorSelection] = useState(null);
  const selectedFloor = room.floors?.find((floor) => floorSelection?.roomId === room.id && floor.level === floorSelection.level) || room.floors?.[0];
  const displayedPrice = selectedFloor?.price ?? room.price;
  const message = contactConfig.defaultMessage
    .replace("{code}", room.code)
    .replace("{area}", room.area) + (selectedFloor ? ` - Lầu ${selectedFloor.level}` : "");
  const similar = getSimilarRooms(rooms, room);
  return (
    <>
      <header className="site-header detail-header">
        <div className="container header-inner">
          <button className="back-link" onClick={onBack}>
            ← <span>Về danh sách phòng</span>
          </button>
          <a className="brand" href="#top" onClick={onBack}>
            <span className="brand-mark">Ở</span>
            <span>
              Gò Vấp<span className="brand-dot">.</span>
            </span>
          </a>
          <a className="header-contact" href={contactConfig.phoneHref}>
            <Phone size={17} /> Gọi ngay
          </a>
        </div>
      </header>
      <main className="detail-page">
        <div className="container">
          <Gallery room={room} onClose={onBack} />
          <div className="detail-layout">
            <article className="detail-content">
              <div className="detail-kicker">
                <span>{room.code}</span>
                <span>
                  {room.status === "upcoming" ? "Sắp trống" : "Đang nhận khách"}
                </span>
              </div>
              <div className="detail-actions"><button className={`detail-action ${isFavorite ? 'is-favorite' : ''}`} onClick={() => onToggleFavorite(room.id)}><Heart size={17} fill={isFavorite ? 'currentColor' : 'none'} /> {isFavorite ? 'Đã lưu' : 'Lưu yêu thích'}</button><button className="detail-action" onClick={() => onShare(room)}><Share2 size={17} /> Chia sẻ</button></div>
              <h1>{room.title}</h1>
              <p className="detail-location">
                {room.area} <span>•</span> {room.district}
              </p>
              <div className="detail-stats">
                <div>
                  <small>Giá thuê</small>
                  <strong>
                    {formatPrice(displayedPrice)} {displayedPrice != null && <i>/ tháng</i>}
                  </strong>
                </div>
                {room.size && <div>
                  <small>Diện tích</small>
                  <strong>{room.size}m²</strong>
                </div>}
              </div>
              {room.floors?.length > 0 && <fieldset className="floor-selector">
                <legend>Chọn lầu</legend>
                <div className="floor-options">
                  {room.floors.map((floor) => <label key={floor.level} className={selectedFloor?.level === floor.level ? "is-selected" : ""}>
                    <input type="radio" name={`floor-${room.id}`} value={floor.level} checked={selectedFloor?.level === floor.level} onChange={() => setFloorSelection({ roomId: room.id, level: floor.level })} />
                    <span>Lầu {floor.level}</span>
                  </label>)}
                </div>
              </fieldset>}
              <div className="detail-block">
                <h3>Về căn phòng</h3>
                <p>{room.description}</p>
              </div>
              <div className="detail-block">
                <h3>Tiện ích trong phòng</h3>
                <div className="amenity-list">
                  {room.amenities.map((amenity) => (
                    <span key={amenity}>
                      <Check size={16} />
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
              <div className="detail-block service-note">
                <h3>Chi phí dịch vụ</h3>
                {room.costs?.length ? <ul>{room.costs.map((cost) => <li key={cost}>{cost}</li>)}</ul> : <p>Liên hệ để được tư vấn chi tiết.</p>}
              </div>
              {room.rules?.length > 0 && <div className="detail-block service-note">
                <h3>Quy định lưu trú</h3>
                <ul>{room.rules.map((rule) => <li key={rule}>{rule}</li>)}</ul>
              </div>}
              <RoomMap room={room} />
            </article>
            <aside className="contact-card">
              <div>
                <span className="card-label">Bạn thích căn này?</span>
                <h3>Đặt lịch xem phòng</h3>
                <p>Mình phản hồi nhanh trong giờ làm việc.</p>
              </div>
              <a
                className="button button-accent"
                href={`${contactConfig.zalo}?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={18} /> Nhắn tư vấn
              </a>
              <a
                className="button button-outline"
                href={`sms:${contactConfig.phoneHref.replace("tel:", "")}?body=${encodeURIComponent(message)}`}
              >
                <Send size={17} /> Đặt lịch xem phòng
              </a>
              <a className="phone-link" href={contactConfig.phoneHref}>
                <Phone size={16} /> {contactConfig.phone}
              </a>
            </aside>
          </div>
          <section className="similar-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Có thể bạn cũng thích</p>
                <h2>Phòng tương tự</h2>
              </div>
              <button className="text-button" onClick={onBack}>
                Xem tất cả <ArrowUpRight size={17} />
              </button>
            </div>
            <div className="room-grid">
              {similar.map((item) => (
                <RoomCard key={item.id} room={item} onOpen={onOpen} isFavorite={false} onToggleFavorite={onToggleFavorite} isCompared={false} onToggleCompare={() => {}} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <div className="mobile-cta">
        <a
          href={`${contactConfig.zalo}?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={18} /> Nhắn tư vấn
        </a>
        <a href={contactConfig.phoneHref}>
          <Phone size={18} />
        </a>
      </div>
    </>
  );
}
