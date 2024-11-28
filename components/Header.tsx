import Link from 'next/link';
import AuthButton from './auth/AuthButton';
// import { MapPin } from 'lucide-react';
import Image from 'next/image'; 

export default function Header() {
  return (
    <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link 
      href="/" 
      className="flex items-center gap-2 text-xl font-bold text-white hover:text-purple-400 transition-colors"
    >
      {/* 로고 이미지 추가 */}
      <Image 
        src="/logo.png" // public 디렉토리 기준 경로
        alt="Berlin Clubs Logo" 
        width={40} // 로고의 너비 설정
        height={40} // 로고의 높이 설정
        className="w-10 h-10" // Tailwind로 크기를 조정할 경우 className 사용 가능
      />
      {/* <span>Berlin Clubs</span> */}
      <span>Berlin Clubs</span>
    </Link>

          {/* 네비게이션 링크들
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/clubs" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Explore
            </Link>
            <Link 
              href="/map" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Map
            </Link>
          </div> */}

          {/* 인증 버튼 */}
          <AuthButton />
        </nav>
      </div>
    </header>
  );
}