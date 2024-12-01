'use client';

import { useState, useEffect } from 'react';
import Map from '@/components/Map';
import ClubList from '@/components/ClubList';
import { Database } from '@/types/database.types';
import { List, X } from 'lucide-react';

type DatabaseClub = Database['public']['Tables']['clubs']['Row'];

interface CoordinatesObject {
  coordinates?: [number, number];
  lng?: number;
  lat?: number;
}

interface MainClientWrapperProps {
  clubs: DatabaseClub[];
}

export default function MainClientWrapper({ clubs }: MainClientWrapperProps) {
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);
  const [showList, setShowList] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 클라이언트 사이드 마운트 후에만 렌더링
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClubSelect = (id: string) => {
    setSelectedClubId(id);
    setShowList(false);
  };

  const toggleList = () => {
    setShowList(prev => !prev);
  };

  // 좌표 변환 로직을 순수 함수로 분리
  const parseCoordinates = (coordinates: any): [number, number] => {
    try {
      if (typeof coordinates === 'string') {
        const parsed = JSON.parse(coordinates) as CoordinatesObject;
        return [
          parsed.coordinates?.[0] || parsed.lng || 0,
          parsed.coordinates?.[1] || parsed.lat || 0
        ];
      } else if (typeof coordinates === 'object') {
        const coordsObj = coordinates as CoordinatesObject;
        return [
          coordsObj.coordinates?.[0] || coordsObj.lng || 0,
          coordsObj.coordinates?.[1] || coordsObj.lat || 0
        ];
      }
    } catch (error) {
      console.error('Failed to parse coordinates:', error);
    }
    return [0, 0];
  };

  // 클럽 데이터 변환을 메모이제이션
  const mapClubs = clubs.map(club => ({
    ...club,
    coordinates: {
      coordinates: parseCoordinates(club.coordinates)
    },
    rating: club.rating ?? 0,
    price_range: club.price_range ?? 1,
    description: club.description || ''
  }));

  const validClubs = mapClubs.filter(club => {
    const [lng, lat] = club.coordinates.coordinates;
    return lng !== 0 && lat !== 0;
  });

  // 초기 마운트 전에는 null 반환
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen relative">
      {/* 모바일 토글 버튼 */}
      <button
        onClick={toggleList}
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-800 text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-lg"
      >
        {showList ? (
          <>
            <X size={20} />
            Close
          </>
        ) : (
          <>
            <List size={20} />
            List
          </>
        )}
      </button>

      {/* 지도 */}
      <div className="relative w-full md:w-2/3 h-[100vh] md:h-[calc(100vh-64px)] order-1 md:order-2 md:sticky md:top-16">
        <Map 
          clubs={validClubs}
          onClubSelect={handleClubSelect}
        />
      </div>

      {/* 클럽 리스트 */}
      <div 
        className={`
          fixed md:relative bottom-0 left-0 right-0 
          w-full md:w-1/3 
          bg-zinc-900 border-t md:border-t-0 md:border-r border-zinc-800 
          order-2 md:order-1 
          transition-transform duration-300 ease-in-out
          ${showList ? 'translate-y-0' : 'translate-y-full'} 
          md:transform-none
          h-[70vh] md:h-full 
          overflow-y-auto
          z-40
        `}
      >
        <ClubList
          clubs={clubs}
          onClubSelect={handleClubSelect}
          selectedClubId={selectedClubId || undefined}
        />
      </div>
    </div>
  );
}