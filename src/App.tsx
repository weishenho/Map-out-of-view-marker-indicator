import { MapContainer, TileLayer } from "react-leaflet";
import MapComponent from "./MapComponent";

const App = () => {
  return (
    <div className="leaflet-container">
      <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapComponent />
      </MapContainer>
    </div>
  );
};

export default App;
