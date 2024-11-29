'use client';

import { useState } from 'react';
import Map from '@/components/Map';
import ClubList from '@/components/ClubList';
import { Database } from '@/types/database.types';

type DatabaseClub = Database['public']['Tables']['clubs']['Row'];

interface MainClientWrapperProps {
  clubs: DatabaseClub[];
}

export default function MainClientWrapper({ clubs }: MainClientWrapperProps) {
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);

  const handleClubSelect = (id: string) => {
    setSelectedClubId(id);
  };

  // coordinates를 정확히 [lng, lat] 튜플 형식으로 변환
  const mapClubs = clubs.map(club => {
    const defaultCoords: [number, number] = [0, 0];
    let coords: [number, number] = defaultCoords;

    if (typeof club.coordinates === 'object' && club.coordinates) {
      const temp = club.coordinates as { lng: number; lat: number };
      coords = [temp.lng || 0, temp.lat || 0];
    }

    return {
      ...club,
      coordinates: {
        coordinates: coords
      }
    };
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
          clubs={mapClubs}
          onClubSelect={handleClubSelect}
          selectedClubId={selectedClubId || undefined}
        />
      </div>
    </div>
  );
}