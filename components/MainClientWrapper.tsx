'use client';

import { useState } from 'react';
import Map from '@/components/Map';
import ClubList from '@/components/ClubList';
import { Database } from '@/types/database.types';

type DatabaseClub = Database['public']['Tables']['clubs']['Row'];

// Map 컴포넌트에서 기대하는 Club 타입
interface MapClub extends Omit<DatabaseClub, 'coordinates'> {
  coordinates: {
    coordinates: [number, number];
  };
}

interface MainClientWrapperProps {
  clubs: DatabaseClub[];
}

export default function MainClientWrapper({ clubs }: MainClientWrapperProps) {
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);

  const handleClubSelect = (id: string) => {
    setSelectedClubId(id);
  };

  // coordinates를 [lng, lat] 배열 형식으로 변환
  const mapClubs = clubs.map(club => ({
    ...club,
    coordinates: {
      coordinates: typeof club.coordinates === 'object' && club.coordinates
        ? [
            (club.coordinates as { lng: number; lat: number }).lng || 0,
            (club.coordinates as { lng: number; lat: number }).lat || 0
          ] as [number, number]
        : [0, 0]
    }
  }));

  return (
    <div className="flex flex-1">
      {/* 왼쪽 사이드바 */}
      <div className="w-1/3 bg-zinc-900 border-r border-zinc-800">
        <ClubList
          clubs={clubs}
          onClubSelect={handleClubSelect}
          selectedClubId={selectedClubId || undefined}
        />
      </div>

      {/* 오른쪽 지도 */}
      <div className="flex-1 relative">
        <Map 
          clubs={mapClubs}
          onClubSelect={handleClubSelect}
          selectedClubId={selectedClubId || undefined}
        />
      </div>
    </div>
  );
}