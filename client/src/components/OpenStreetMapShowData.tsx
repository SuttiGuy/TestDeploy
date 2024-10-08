import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  lat: number;
  lng: number;
}

interface OverpassResponse {
  elements: Element[];
}

interface Element {
  tags: {
    name?: string;
  };
}

const OpenStreetMapShowData: React.FC<MapComponentProps> = ({ lat, lng }) => {
  const [places, setPlaces] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const placesPerPage = 3;

  useEffect(() => {
    const map = L.map('map', { zoomControl: false }).setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    L.marker([lat, lng]).addTo(map)
      .bindPopup(`ตำแหน่งสถานที่คือ: [${lat}, ${lng}]`)
      .openPopup();

    L.circle([lat, lng], {
      color: "#4B99FA",
      fillColor: "#72B1FF",
      fillOpacity: 0.3,
      radius: 1000,
    }).addTo(map);

    const fetchPlaces = async () => {
      try {
        const response = await fetch(`https://overpass-api.de/api/interpreter?data=[out:json];node(around:1000,${lat},${lng})["tourism"~"attraction|museum|viewpoint|park|zoo|pub|tech"];out;`);
        const data: OverpassResponse = await response.json();

        const placesList: string[] = data.elements
          .map((element: Element) => element.tags.name)
          .filter((name: string | undefined): name is string => !!name);

        if (placesList.length === 0) {
          placesList.push('ไม่มีสถานที่ท่องเที่ยวในรัศมีนี้');
        }
        setPlaces(placesList);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
        setPlaces(['เกิดข้อผิดพลาดในการดึงข้อมูล']);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();

    return () => {
      map.remove();
    };
  }, [lat, lng]);

  const indexOfLastPlace = currentPage * placesPerPage;
  const indexOfFirstPlace = indexOfLastPlace - placesPerPage;
  const currentPlaces = places.slice(indexOfFirstPlace, indexOfLastPlace);

  const handleNextPage = () => {
    if (currentPage * placesPerPage < places.length) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div id="map" className="h-72 w-full rounded-lg shadow-md mb-4"></div>
      <div className="card-box shadow-xl rounded-lg p-4">
        <h3 className="text-lg font-medium mb-2 text-gray-700">สถานที่ท่องเที่ยวใกล้เคียง</h3>
        {loading ? (
          <p className="text-center text-gray-500">กำลังโหลดข้อมูลสถานที่...</p>
        ) : (
          currentPlaces.length > 0 ? (
            <div className="space-y-2">
              {currentPlaces.map((place, index) => (
                <div key={index} className="p-4 border border-gray-300 rounded-md">
                  {place}
                </div>
              ))}
              <div className="flex justify-between mt-4">
                <button
                  onClick={handlePreviousPage}
                  className={`px-4 py-2 bg-gray-200 text-gray-600 rounded ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                  disabled={currentPage === 1}
                >
                  ก่อนหน้า
                </button>
                <button
                  onClick={handleNextPage}
                  className={`px-4 py-2 bg-blue-500 text-gray-100 rounded ${currentPage * placesPerPage >= places.length ? 'cursor-not-allowed opacity-50' : ''}`}
                  disabled={currentPage * placesPerPage >= places.length}
                >
                  ถัดไป
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">ไม่มีสถานที่ท่องเที่ยวในรัศมีนี้</p>
          )
        )}
      </div>
    </div>
  );
};

export default OpenStreetMapShowData;
