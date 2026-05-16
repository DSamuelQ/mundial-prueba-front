// src/components/PedidoMapa.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix para íconos por defecto de Leaflet (React + webpack)
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = defaultIcon;

export default function PedidoMapa({ lat, lng, zoom = 16, title = "Ubicación del pedido" }) {
  const latNum = Number(lat);
  const lngNum = Number(lng);

  if (!isFinite(latNum) || !isFinite(lngNum)) {
    return <div style={{ padding: "0.5rem" }}>No hay ubicación válida</div>;
  }

  // Cambia height y width para agrandar el mapa
  return (
    <div style={{ height: "500px", width: "100%", maxWidth: "1000px", margin: "1rem auto" }}>
      <MapContainer
        center={[latNum, lngNum]}
        zoom={zoom}
        style={{ height: "100%", width: "100%", borderRadius: "12px" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[latNum, lngNum]}>
          <Popup>
            <strong>{title}</strong>
            <br />
            Lat: {latNum}, Lng: {lngNum}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
