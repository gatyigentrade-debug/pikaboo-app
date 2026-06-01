import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { format } from "date-fns";

// Fix default marker icons for Vite/webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom flame pin icon
const flameIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:36px;height:36px;border-radius:50% 50% 50% 0;
    background:linear-gradient(135deg,#f97316,#ea580c);
    transform:rotate(-45deg);
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 0 12px rgba(249,115,22,0.6);
    border:2px solid rgba(255,255,255,0.3);
  ">
    <span style="transform:rotate(45deg);font-size:16px;line-height:1;">🥩</span>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -40],
});

// SA city coordinates lookup
const SA_CITIES = {
  "johannesburg": [-26.2041, 28.0473],
  "joburg": [-26.2041, 28.0473],
  "jozi": [-26.2041, 28.0473],
  "cape town": [-33.9249, 18.4241],
  "durban": [-29.8587, 31.0218],
  "pretoria": [-25.7479, 28.2293],
  "tshwane": [-25.7479, 28.2293],
  "port elizabeth": [-33.9608, 25.6022],
  "gqeberha": [-33.9608, 25.6022],
  "bloemfontein": [-29.0852, 26.1596],
  "east london": [-33.0153, 27.9116],
  "polokwane": [-23.9045, 29.4688],
  "nelspruit": [-25.4753, 30.9694],
  "mbombela": [-25.4753, 30.9694],
  "kimberley": [-28.7282, 24.7499],
  "rustenburg": [-25.6674, 27.2423],
  "soweto": [-26.2678, 27.8585],
  "sandton": [-26.1076, 28.0567],
  "centurion": [-25.8600, 28.1880],
  "stellenbosch": [-33.9321, 18.8602],
  "george": [-33.9646, 22.4617],
  "witbank": [-25.8753, 29.2428],
  "emalahleni": [-25.8753, 29.2428],
};

function getCityCoords(city) {
  if (!city) return null;
  const key = city.toLowerCase().trim();
  for (const [name, coords] of Object.entries(SA_CITIES)) {
    if (key.includes(name) || name.includes(key)) return coords;
  }
  return null;
}

// Default center: South Africa
const SA_CENTER = [-28.5, 25.5];

export default function MeetupsMap({ meetups, onJoin, joinedIds }) {
  const mappableMeetups = meetups
    .map((m) => ({ ...m, coords: getCityCoords(m.city || m.location_name) }))
    .filter((m) => m.coords);

  const center = mappableMeetups.length > 0 ? mappableMeetups[0].coords : SA_CENTER;
  const zoom = mappableMeetups.length > 0 ? 10 : 6;

  return (
    <div className="rounded-2xl overflow-hidden border border-border/40" style={{ height: 380 }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        {mappableMeetups.map((meetup) => (
          <Marker key={meetup.id} position={meetup.coords} icon={flameIcon}>
            <Popup className="braai-popup">
              <div className="bg-card text-foreground rounded-xl p-3 min-w-[200px] space-y-2">
                <p className="font-heading font-bold text-sm text-foreground">{meetup.title}</p>
                <p className="text-xs text-muted-foreground">📍 {meetup.location_name}{meetup.city ? `, ${meetup.city}` : ""}</p>
                {meetup.date && (
                  <p className="text-xs text-muted-foreground">
                    🗓️ {format(new Date(meetup.date), "EEE d MMM, HH:mm")}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  👥 {(meetup.attendee_ids || []).length}/{meetup.max_attendees || 20} going
                </p>
                <button
                  onClick={() => onJoin(meetup)}
                  disabled={joinedIds.includes(meetup.id)}
                  className={`w-full mt-1 py-1.5 rounded-full text-xs font-heading font-bold transition-opacity ${
                    joinedIds.includes(meetup.id)
                      ? "bg-secondary text-muted-foreground cursor-default"
                      : "bg-primary text-primary-foreground hover:opacity-90"
                  }`}
                >
                  {joinedIds.includes(meetup.id) ? "✓ Joined" : "🔥 Join Braai"}
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {mappableMeetups.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/80 rounded-2xl">
          <p className="text-muted-foreground text-sm font-body">No meetups with known locations</p>
        </div>
      )}
    </div>
  );
}