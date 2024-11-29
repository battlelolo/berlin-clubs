// components/MainClientWrapper.tsx
'use client';

import { useState } from 'react';
import Map from '@/components/Map';
import ClubList from '@/components/ClubList';

interface Club {
  id: string;
  name: string;
  description: string;
  location: string;
  // coordinates: any;
  coordinates: {
    lng: number;
    lat: number;
  };
  music_types: string[];
  rating: number;
  price_range: number;
  features: string[];
  images?: string[];
}

interface MainClientWrapperProps {
  clubs: Club[];
}

export default function MainClientWrapper({ clubs }: MainClientWrapperProps) {
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);

  const handleClubSelect = (id: string) => {
    setSelectedClubId(id);
  };

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
          clubs={clubs} 
          onClubSelect={handleClubSelect}
          selectedClubId={selectedClubId || undefined}
        />
      </div>
    </div>
  );
}