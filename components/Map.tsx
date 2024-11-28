'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Club {
  id: string;
  name: string;
  location: string;
  coordinates: { coordinates: [number, number] };
  rating: number;
  price_range: number;
  description?: string;
}

interface MapProps {
  clubs: Club[];
  onClubSelect?: (clubId: string) => void;
}

export default function Map({ clubs, onClubSelect }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [13.4050, 52.5200], // Berlin coordinates
      zoom: 11,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for each club
    clubs.forEach((club) => {
      // 커스텀 마커 요소 생성
      const el = document.createElement('div');
      el.className = 'custom-marker';
      
      // 마커 스타일링
      el.innerHTML = `
        <div class="bg-purple-500 text-white px-2 py-1 rounded-full font-bold shadow-lg">
          ${'€'.repeat(club.price_range)}
        </div>
      `;

      // 마커 클릭 이벤트
      el.addEventListener('click', () => {
        if (onClubSelect) {
          onClubSelect(club.id);
        }
      });

      // 팝업 생성
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        maxWidth: '300px'
      }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold text-lg mb-1">${club.name}</h3>
          <p class="text-gray-600 mb-2">${club.location}</p>
          <div class="flex items-center gap-2">
            <span class="text-yellow-500">${'★'.repeat(Math.round(club.rating))}</span>
            <span class="text-gray-600">${club.rating.toFixed(1)}</span>
          </div>
          ${club.description ? `<p class="text-sm mt-2">${club.description}</p>` : ''}
        </div>
      `);

      // 마커 생성 및 지도에 추가
      new mapboxgl.Marker(el)
        .setLngLat(club.coordinates.coordinates)
        .setPopup(popup)
        .addTo(map);
    });

    // Fit bounds to include all markers
    if (clubs.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      clubs.forEach(club => {
        bounds.extend(club.coordinates.coordinates);
      });
      map.fitBounds(bounds, { padding: 50 });
    }

    return () => map.remove();
  }, [clubs, onClubSelect]);

  return (
    <>
      <div ref={mapRef} className="w-full h-full min-h-[500px]" />
      <style jsx global>{`
        .custom-marker {
          cursor: pointer;
          transition: transform 0.3s;
        }
        .custom-marker:hover {
          transform: scale(1.1);
        }
        .mapboxgl-popup-content {
          border-radius: 8px;
          padding: 0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
      `}</style>
    </>
  );
}