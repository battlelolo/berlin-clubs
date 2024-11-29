'use client';

import { useState } from 'react';
import Map from '@/components/Map';
import ClubList from '@/components/ClubList';
import { Database } from '@/types/database.types';

type DatabaseClub = Database['public']['Tables']['clubs']['Row'];

interface MainClientWrapperProps {
  clubs: DatabaseClub[];
}

// 좌표 데이터의 가능한 형식을 정의
interface CoordinatesObject {
  coordinates?: [number, number];
  lng?: number;
  lat?: number;
}

export default function MainClientWrapper({ clubs }: MainClientWrapperProps) {
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);

  const handleClubSelect = (id: string) => {
    setSelectedClubId(id);
  };

  const mapClubs = clubs.map(club => {
    let coords: [number, number] = [0, 0];

    if (club.coordinates) {
      try {
        // JSON string인 경우 처리
        if (typeof club.coordinates === 'string') {
          const parsed = JSON.parse(club.coordinates) as CoordinatesObject;
          coords = [
            parsed.coordinates?.[0] || parsed.lng || 0,
            parsed.coordinates?.[1] || parsed.lat || 0
          ];
        }
        // Object인 경우 처리
        else if (typeof club.coordinates === 'object') {
          const coordsObj = club.coordinates as CoordinatesObject;
          coords = [
            coordsObj.coordinates?.[0] || coordsObj.lng || 0,
            coordsObj.coordinates?.[1] || coordsObj.lat || 0
          ];
        }
      } catch (error) {
        console.error(`Failed to parse coordinates for club ${club.id}:`, error);
      }
    }

    return {
      ...club,
      coordinates: {
        coordinates: coords
      },
      rating: club.rating ?? 0,
      price_range: club.price_range ?? 1,
      description: club.description || undefined
    };
  });

  // 유효한 좌표가 있는 클럽만 필터링
  const validClubs = mapClubs.filter(club => {
    const [lng, lat] = club.coordinates.coordinates;
    return lng !== 0 && lat !== 0;
  });

  return (
    <div className="flex flex-1">
      <div className="w-1/3 bg-zinc-900 border-r border-zinc-800">
        <ClubList
          clubs={clubs}
          onClubSelect={handleClubSelect}
          selectedClubId={selectedClubId || undefined}
        />
      </div>

      <div className="flex-1 relative">
        <Map 
          clubs={validClubs}
          onClubSelect={handleClubSelect}
        />
      </div>
    </div>
  );
}