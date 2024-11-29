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
      const el = document.createElement('div');
      el.className = 'custom-marker';
      
      el.innerHTML = `
        <div class="bg-purple-500 text-white px-2 py-1 rounded-full font-bold shadow-lg">
          ${'€'.repeat(club.price_range)}
        </div>
      `;

      el.addEventListener('click', () => {
        if (onClubSelect) {
          onClubSelect(club.id);
        }
      });

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        maxWidth: '300px',
        className: 'dark-theme-popup' // 커스텀 클래스 추가
      }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold text-lg mb-1 text-white">${club.name}</h3>
          <p class="text-gray-300 mb-2">${club.location}</p>
          <div class="flex items-center gap-2">
            <span class="text-yellow-500">${'★'.repeat(Math.round(club.rating))}</span>
            <span class="text-gray-300">${club.rating.toFixed(1)}</span>
          </div>
          ${club.description ? `<p class="text-gray-300 text-sm mt-2">${club.description}</p>` : ''}
        </div>
      `);

      new mapboxgl.Marker(el)
        .setLngLat(club.coordinates.coordinates)
        .setPopup(popup)
        .addTo(map);
    });

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
        /* 다크 테마 팝업 스타일 */
        .dark-theme-popup .mapboxgl-popup-content {
          background-color: rgb(24 24 27); /* bg-zinc-900 */
          border-radius: 8px;
          padding: 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          color: white;
        }
        .dark-theme-popup .mapboxgl-popup-tip {
          border-top-color: rgb(24 24 27) !important; /* 팝업 화살표 색상 */
          border-bottom-color: rgb(24 24 27) !important;
        }
        /* 화살표 방향에 따른 스타일 */
        .dark-theme-popup.mapboxgl-popup-anchor-top .mapboxgl-popup-tip {
          border-bottom-color: rgb(24 24 27) !important;
        }
        .dark-theme-popup.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
          border-top-color: rgb(24 24 27) !important;
        }
        .dark-theme-popup.mapboxgl-popup-anchor-left .mapboxgl-popup-tip {
          border-right-color: rgb(24 24 27) !important;
        }
        .dark-theme-popup.mapboxgl-popup-anchor-right .mapboxgl-popup-tip {
          border-left-color: rgb(24 24 27) !important;
        }
      `}</style>
    </>
  );
}