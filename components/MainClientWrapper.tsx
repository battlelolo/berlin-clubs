'use client';

import { useState, useEffect } from 'react';
import Map from '@/components/Map';
import ClubList from '@/components/ClubList';
import { Database } from '@/types/database.types';
import { List, X } from 'lucide-react';

// Database types
type Tables = Database['public']['Tables'];
type DatabaseClub = Tables['clubs']['Row'];

// Coordinate types
interface CoordinatesObject {
  coordinates?: [number, number];
  lng?: number;
  lat?: number;
}

type CoordinatesInput = string | CoordinatesObject | null | undefined;

// Props type
interface MainClientWrapperProps {
  clubs: DatabaseClub[];
}

// Extended club type with known coordinates type
interface ClubWithCoordinates extends Omit<DatabaseClub, 'coordinates'> {
  coordinates: CoordinatesInput;
}

export default function MainClientWrapper({ clubs }: MainClientWrapperProps) {
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);
  const [showList, setShowList] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  const parseCoordinates = (coordinates: CoordinatesInput): [number, number] => {
    try {
      if (typeof coordinates === 'string') {
        const parsed = JSON.parse(coordinates) as CoordinatesObject;
        return [
          parsed.coordinates?.[0] || parsed.lng || 0,
          parsed.coordinates?.[1] || parsed.lat || 0
        ];
      } else if (coordinates && typeof coordinates === 'object') {
        return [
          coordinates.coordinates?.[0] || coordinates.lng || 0,
          coordinates.coordinates?.[1] || coordinates.lat || 0
        ];
      }
    } catch (error) {
      console.error('Failed to parse coordinates:', error);
    }
    return [0, 0];
  };

  const mapClubs = (clubs as ClubWithCoordinates[]).map(club => ({
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

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen relative">
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

      <div className="relative w-full md:w-2/3 h-[100vh] md:h-[calc(100vh-64px)] order-1 md:order-2 md:sticky md:top-16">
        <Map 
          clubs={validClubs}
          onClubSelect={handleClubSelect}
        />
      </div>

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