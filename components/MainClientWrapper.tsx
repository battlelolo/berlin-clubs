'use client';

import { useState, useMemo } from 'react';
import Map from '@/components/Map';
import ClubList from '@/components/ClubList';
import { Database } from '@/types/database.types';

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

  const processedClubs = useMemo(() => {
    return clubs.map(club => {
      let coords: [number, number] = [0, 0];

      if (club.coordinates) {
        try {
          if (typeof club.coordinates === 'string') {
            const parsed = JSON.parse(club.coordinates) as CoordinatesObject;
            coords = [
              parsed.coordinates?.[0] || parsed.lng || 0,
              parsed.coordinates?.[1] || parsed.lat || 0
            ];
          } else if (typeof club.coordinates === 'object') {
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
        rating: club.rating ?? 0, // null인 경우 0으로 처리
        price_range: club.price_range ?? 1,
        description: club.description || "",
        address: club.address || "",
        music_types: club.music_types || [],
        images: club.images || []
      };
    });
  }, [clubs]);

  const validClubs = useMemo(() => {
    return processedClubs.filter(club => {
      const [lng, lat] = club.coordinates.coordinates;
      return lng !== 0 && lat !== 0;
    });
  }, [processedClubs]);

  const handleClubSelect = (id: string) => {
    setSelectedClubId(id);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="fixed w-full h-[30vh] md:relative md:w-2/3 md:h-[calc(100vh-64px)] order-1 md:order-2 md:sticky md:top-16 z-10">
        <Map 
          clubs={validClubs}
          onClubSelect={handleClubSelect}
        />
      </div>

      <div className="w-full mt-[30vh] md:mt-0 md:w-1/3 bg-zinc-900 border-t md:border-t-0 md:border-r border-zinc-800 order-2 md:order-1 md:h-full overflow-y-auto">
        <ClubList
          clubs={processedClubs}
          onClubSelect={handleClubSelect}
          selectedClubId={selectedClubId || undefined}
        />
      </div>
    </div>
  );
}