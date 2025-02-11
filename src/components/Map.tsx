// components/Map.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet's CSS for proper styling

const containerStyle = {
  width: "1800px",
  height: "850px",
};

const defaultCenter = {
  lat: 34.0689, // Default to UCLA
  lng: -118.4452,
};

export default function Map() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [locations, setLocations] = useState<{ lat: number; lng: number }[]>([]);

  useEffect(() => {
    const fetchLocations = () => {
      const storedLocations = JSON.parse(localStorage.getItem("userLocations") || "[]");
      setLocations(storedLocations);
    };
    fetchLocations();
    const interval = setInterval(fetchLocations, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      // Initialize the Leaflet map
      mapRef.current = L.map(mapContainerRef.current).setView([defaultCenter.lat, defaultCenter.lng], 12);

      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);
    }

    // Remove old markers before adding new ones
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Add new markers to the map
    locations.forEach((loc) => {
      L.marker([loc.lat, loc.lng]).addTo(mapRef.current!);
    });

  }, [locations]);

  return <div ref={mapContainerRef} style={containerStyle} />;
}
