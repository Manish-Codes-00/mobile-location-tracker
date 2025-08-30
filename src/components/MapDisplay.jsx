
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function RecenterMap({ lat, lng }) {
  const map = useMap();
  map.setView([lat, lng], 8);
  return null;
}

export default function MapDisplay({ latitude, longitude, location, country }) {
  if (!latitude || !longitude) return null;

  return (
    <div className="mt-6 rounded-xl overflow-hidden shadow-lg border">
      <MapContainer
        center={[latitude, longitude]}
        zoom={6}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]}>
          <Popup>
            {location}, {country}
          </Popup>
        </Marker>
        <RecenterMap lat={latitude} lng={longitude} />
      </MapContainer>
    </div>
  );
}
