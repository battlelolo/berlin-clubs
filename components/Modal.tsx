'use client';

import { useState, useEffect } from 'react';
import MainClientWrapper from './MainClientWrapper';
import { Database } from '@/types/database.types';

// Database types (MainClientWrapper와 동일한 타입 사용)
type Tables = Database['public']['Tables'];
type DatabaseClub = Tables['clubs']['Row'];

interface ModalProps {
  clubs: DatabaseClub[]; // MainClientWrapper와 동일한 타입 사용
}

export default function Modal({ clubs }: ModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 페이지 로드 시 모달 자동 열기
  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = () => setIsModalOpen(false);

  const handleJoinWaitlist = () => {
    window.open('https://forms.gle/wBR8VfEd9TiHYMuHA', '_blank');
  };

  return (
    <div className="flex flex-col h-full">
      {/* MainClientWrapper 렌더링 */}
      <MainClientWrapper clubs={clubs} />

      {/* 모달 UI */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-gray-900 rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-300 mb-4">Welcome!</h2>
            <p className="text-gray-400 mb-4">Thanks for visiting! We are pausing the service at the moment, but will be back with mobile apps in 2026.</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-800"
              >
                Close
              </button>
              <button
                onClick={handleJoinWaitlist}
                className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
              >
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}