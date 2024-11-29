// components/ClubCard.tsx
'use client';

import { Database } from '@/types/database.types';
import { Music, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

type Club = Database['public']['Tables']['clubs']['Row'];


interface ClubCardProps {
  club: Club;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

// export default function ClubCard({ club, selected, onSelect }: ClubCardProps) {
//   return (
//     <Link href={`/clubs/${encodeURIComponent(club.name)}`}>
//       <div
//         onClick={() => onSelect?.(club.id)}
//         className={`
//           bg-zinc-800 rounded-lg overflow-hidden cursor-pointer 
//           transition-all duration-200 hover:bg-zinc-700
//           ${selected ? 'ring-2 ring-purple-500' : ''}
//         `}
//       >
//         {/* 이미지 섹션 */}
//         <div className="relative h-48">
//           <img
//             src={club.image_url || "/api/placeholder/400/300"}
//             alt={club.name}
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute top-4 right-4 bg-purple-500 text-white px-2 py-1 rounded-full font-bold">
//             {club.rating.toFixed(1)}
//           </div>
//         </div>
export default function ClubCard({ club, selected, onSelect }: ClubCardProps) {
  return (
    <Link href={`/clubs/${encodeURIComponent(club.name)}`}>
      <div
        onClick={() => onSelect?.(club.id)}
        className={`
          bg-zinc-800 rounded-lg overflow-hidden cursor-pointer 
          transition-all duration-200 hover:bg-zinc-700
          ${selected ? 'ring-2 ring-purple-500' : ''}
        `}
      >
        {/* 이미지 섹션 */}
        <div className="relative h-48">
          <Image
            src={club.image_url || "/api/placeholder/400/300"}
            alt={club.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 right-4 bg-purple-500 text-white px-2 py-1 rounded-full font-bold z-10">
            {club.rating.toFixed(1)}
          </div>
        </div>

        {/* 정보 섹션 */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-white">{club.name}</h3>
            <div className="text-gray-400">
              {'€'.repeat(club.price_range)}
            </div>
          </div>

          <div className="flex items-center text-gray-400 mb-2">
            <MapPin size={16} className="mr-1" />
            <span className="text-sm">{club.location}</span>
          </div>

          {club.music_types && (
            <div className="flex items-center text-gray-400">
              <Music size={16} className="mr-1" />
              <div className="flex flex-wrap gap-1">
                {club.music_types.map((type) => (
                  <span
                    key={type}
                    className="text-xs bg-zinc-900 px-2 py-1 rounded-full"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}