'use client';

import { Database } from '@/types/database.types';
import ClubCard from './ClubCard';
import { Search } from 'lucide-react';
import { useState } from 'react';

type Club = Database['public']['Tables']['clubs']['Row'];

interface ClubListProps {
  clubs: Club[];
  onClubSelect: (id: string) => void;
  selectedClubId?: string;
}

export default function ClubList({ clubs, onClubSelect, selectedClubId }: ClubListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [musicFilter, setMusicFilter] = useState<string | null>(null);

  // 초기 clubs 배열을 랜덤하게 섞어서 사용
  const shuffledClubs = [...clubs].sort(() => Math.random() - 0.5);

  const filteredClubs = shuffledClubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMusic = !musicFilter || club.music_types?.includes(musicFilter);
    return matchesSearch && matchesMusic;
  });

  const allMusicTypes = Array.from(
    new Set(clubs.flatMap(club => club.music_types || []))
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-zinc-700">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search clubs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {allMusicTypes.map((type) => (
            <button
              key={type}
              onClick={() => setMusicFilter(musicFilter === type ? null : type)}
              className={`px-3 py-1 rounded-full text-sm transition-colors
                ${musicFilter === type 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-zinc-900 text-gray-400 hover:bg-zinc-700'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {filteredClubs.map((club) => (
            <ClubCard
              key={club.id}
              club={club}
              selected={club.id === selectedClubId}
              onSelect={onClubSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
}