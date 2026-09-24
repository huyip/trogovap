import { useEffect, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Check,
  ChevronRight,
  Heart,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";
import Header from "./components/Header";
import RoomCard from "./components/RoomCard";
import Gallery from "./components/Gallery";
import SearchPanel from "./components/SearchPanel";
import AdminPage from "./components/AdminPage";
import { contactConfig } from "./config/contact";
import { districts, rooms as initialRooms } from "./data/rooms";
import { filterRooms, formatPrice, getSimilarRooms } from "./utils/room";

const defaultFilters = {
  query: "",
  district: "Gò Vấp",
  area: "",
  price: "",
  size: "",
  amenities: [],
};
const appBase = import.meta.env.BASE_URL;
const appPath = (path = "") => `${appBase}${path}`;

export default function App() {
  const [rooms, setRooms] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ogovap-rooms")) || initialRooms;
    } catch {
      return initialRooms;
    }
  });
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [admin, setAdmin] = useState(window.location.pathname === "/admin");
  const [returnScrollY, setReturnScrollY] = useState(0);
  useEffect(
    () => localStorage.setItem("ogovap-rooms", JSON.stringify(rooms)),
    [rooms],
  );
  useEffect(() => {
    const roomCode = window.location.pathname.match(/\/phong\/([^/]+)/)?.[1];
    if (roomCode) {
      const room = rooms.find((item) => item.code === roomCode);
      if (room) setSelectedRoom(room);
    }
  }, [rooms]);
  useEffect(() => {
    document.title = selectedRoom
      ? `${selectedRoom.code} | Ở Gò Vấp`
      : admin
        ? "Quản trị | Ở Gò Vấp"
        : "Ở Gò Vấp | Tìm phòng trọ dễ hơn";
  }, [selectedRoom, admin]);
  const filteredRooms = filterRooms(rooms, filters);
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
    window.history.pushState({}, "", appPath());
    window.requestAnimationFrame(() => window.scrollTo({ top: previousScrollY }));
  };
  const goAdmin = () => {
    setAdmin(true);
    setSelectedRoom(null);
    window.history.pushState({}, "", appPath("admin"));
    window.scrollTo({ top: 0 });
  };
  if (admin)
    return <AdminPage rooms={rooms} setRooms={setRooms} onBack={backHome} />;
  if (selectedRoom)
    return <RoomDetail room={selectedRoom} rooms={rooms} onBack={backHome} onOpen={openRoom} />;
  return (
    <Home
      rooms={filteredRooms}
      filters={filters}
      setFilters={setFilters}
      onOpen={openRoom}
      onFindRooms={() =>
        document
          .getElementById("find-rooms")
          ?.scrollIntoView({ behavior: "smooth" })
      }
      onAdmin={goAdmin}
    />
  );
}

function Home({ rooms, filters, setFilters, onOpen, onFindRooms, onAdmin }) {
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
      <Header onFindRooms={onFindRooms} />
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
                    <img src={room.images[0]} alt={room.title} />
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
                <RoomCard key={room.id} room={room} onOpen={onOpen} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
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

function RoomDetail({ room, rooms, onBack, onOpen }) {
  const message = contactConfig.defaultMessage
    .replace("{code}", room.code)
    .replace("{area}", room.area);
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
              <h1>{room.title}</h1>
              <p className="detail-location">
                {room.area} <span>•</span> {room.district}
              </p>
              <div className="detail-stats">
                <div>
                  <small>Giá thuê</small>
                  <strong>
                    {formatPrice(room.price)} <i>/ tháng</i>
                  </strong>
                </div>
                <div>
                  <small>Diện tích</small>
                  <strong>{room.size}m²</strong>
                </div>
              </div>
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
                <p>Liên hệ để được tư vấn chi tiết.</p>
              </div>
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
                <RoomCard key={item.id} room={item} onOpen={onOpen} />
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
