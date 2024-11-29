'use client';

import { useState } from 'react';
import Map from '@/components/Map';
import ClubList from '@/components/ClubList';
import { Database } from '@/types/database.types';

// database.types에서 Club 타입을 가져옴
type Club = Database['public']['Tables']['clubs']['Row'];

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