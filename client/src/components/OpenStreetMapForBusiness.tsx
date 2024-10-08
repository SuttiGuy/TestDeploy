// MapComponent.tsx
import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationDetails {
  latitude: number;
  longitude: number;
}

interface MapComponentProps {
  onLocationChange: (location: LocationDetails) => void;
}

const OpenStreetMapForBusiness: React.FC<MapComponentProps> = ({ onLocationChange }) => {
  
  useEffect(() => {
    const map = L.map("map").setView([13.7563, 100.5018], 15);
    let marker: L.Marker | undefined;
    let circle: L.Circle | undefined;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    const placeMarkerAndCircle = (latlng: L.LatLng) => {
      if (marker) {
        map.removeLayer(marker);
      }
      if (circle) {
        map.removeLayer(circle);
      }
      map.closePopup();

      const popupContent = "ตำแหน่งของคุณ: " + latlng.toString();
      marker = L.marker(latlng)
        .addTo(map)
        .bindPopup(popupContent)
        .openPopup();

      circle = L.circle(latlng, {
        color: "#4B99FA",
        fillColor: "#72B1FF",
        fillOpacity: 0.3,
        radius: 1000,
      }).addTo(map);

      const details: LocationDetails = {
        latitude: latlng.lat,
        longitude: latlng.lng,
      };

      onLocationChange(details);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentLocation = L.latLng(latitude, longitude);
          
          map.setView(currentLocation, 15);

          placeMarkerAndCircle(currentLocation);
        },
        () => {
          console.log("ไม่สามารถดึงตำแหน่งปัจจุบันได้");
        }
      );
    }

    map.on("click", function (e: L.LeafletMouseEvent) {
      placeMarkerAndCircle(e.latlng);
    });

    return () => {
      map.remove();
    };
  }, []);

  return <div id="map" className="w-full h-full"></div>;
};

export default OpenStreetMapForBusiness;