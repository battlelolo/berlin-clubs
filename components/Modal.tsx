'use client';

import { useState, useEffect } from 'react';
import MainClientWrapper from './MainClientWrapper';

interface ModalProps {
  clubs: any[]; // clubs 타입은 MainClientWrapper에 맞게 유지
}

export default function Modal({ clubs }: ModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 페이지 로드 시 모달 자동 열기
  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = () => setIsModalOpen(false);

  const handleJoinWaitlist = () => {
    alert('Thank you for joining the waitlist! We will notify you when the service is back in 2026.');
    // 나중에 Supabase나 외부 API로 대기 목록에 등록 로직을 추가할 수 있음
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
              {/* <button
                onClick={handleJoinWaitlist}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                Join Waitlist
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}