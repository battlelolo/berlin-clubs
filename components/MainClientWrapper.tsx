'use client';

import { useState } from 'react';
import Map from '@/components/Map';
import ClubList from '@/components/ClubList';
import { Database } from '@/types/database.types';

// 데이터베이스의 Club 타입
type DatabaseClub = Database['public']['Tables']['clubs']['Row'];

// Map 컴포넌트를 위한 Club 타입
interface MapClub extends Omit<DatabaseClub, 'coordinates'> {
  coordinates: {
    lat: number;
    lng: number;
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

  // coordinates 형식 변환
  const mapClubs = clubs.map(club => ({
    ...club,
    coordinates: typeof club.coordinates === 'object' && club.coordinates
      ? {
          lat: (club.coordinates as any).lat || 0,
          lng: (club.coordinates as any).lng || 0,
        }
      : { lat: 0, lng: 0 }
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