// app/clubs/[name]/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { MapPin } from 'lucide-react';
import Image from 'next/image';
import ReviewsSection from '@/components/reviews/ReviewsSection';
import { Suspense } from 'react';
import { Database } from '@/types/database.types';

type Club = Database['public']['Tables']['clubs']['Row'];

type PageProps = {
  params: Promise<{
    name: string;
  }>;
}

async function getClub(clubName: string) {
  const supabase = createServerComponentClient({
    cookies
  });
  const decodedName = decodeURIComponent(clubName);
  
  const { data: club } = await supabase
    .from('clubs')
    .select('*')
    .eq('name', decodedName)
    .single();

  return club as Club;
}

export default async function ClubPage({ params }: PageProps) {
  const resolvedParams = await params;
  const club = await getClub(resolvedParams.name);

  if (!club) {
    return <div>Club not found</div>;
  }

  return <ClubContent club={club} />;
}

const ClubContent = ({ club }: { club: Club }) => {
  return (
    <div className="min-h-screen bg-zinc-900">
     <div className="relative h-96">
  <Image
    src={club.images?.[0] || "/api/placeholder/400/300"}
    alt={club.name}
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    priority
  />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <h1 className="text-4xl font-bold text-white mb-2">{club.name}</h1>
          <div className="flex items-center gap-4 text-gray-300">
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              {club.location}
            </div>
            {club.price_range && (
              <div className="text-xl">{'€'.repeat(club.price_range)}</div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {club.description && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">About</h2>
                <p className="text-gray-300">{club.description}</p>
              </div>
            )}

            {club.music_types && club.music_types.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Music</h2>
                <div className="flex flex-wrap gap-2">
                  {club.music_types.map((type: string) => (
                    <span
                      key={type}
                      className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <Suspense fallback={<div>Loading reviews...</div>}>
              <ReviewsSection clubId={club.id} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

// // app/clubs/[name]/page.tsx
// import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
// import { cookies } from 'next/headers';
// import { MapPin } from 'lucide-react'; // Music import 제거
// import Image from 'next/image'; // Image import 추가
// import ReviewsSection from '@/components/reviews/ReviewsSection';
// import { Suspense } from 'react';

// // Club 타입 정의 추가
// interface Club {
//   id: string;
//   name: string;
//   image_url: string;
//   location: string;
//   price_range: number;
//   description: string;
//   music_types: string[];
// }

// async function getSupabase() {
//   const cookieStore = await cookies();
//   return createServerComponentClient({ cookies: () => cookieStore });
// }

// async function getClub(clubName: string) {
//   const supabase = await getSupabase();
//   const decodedName = decodeURIComponent(clubName);
  
//   const { data: club } = await supabase
//     .from('clubs')
//     .select('*')
//     .eq('name', decodedName)
//     .single();

//   return club as Club;
// }

// interface PageProps {
//   params: Promise<{
//     name: string;
//   }>;
// }

// export default async function ClubPage({ params }: PageProps) {
//   const resolvedParams = await params;
//   const club = await getClub(resolvedParams.name);

//   if (!club) {
//     return <div>Club not found</div>;
//   }

//   return <ClubContent clubId={club.id} club={club} />;
// }

// const ClubContent = ({ club }: { club: Club }) => { // any를 Club으로 변경
//   return (
//     <div className="min-h-screen bg-zinc-900">
//       {/* 커버 이미지 섹션 */}
//       <div className="relative h-96">
//         <Image
//           src={club.image_url || `/api/placeholder/1200/400`}
//           alt={club.name}
//           fill
//           className="object-cover"
//           priority
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-zinc-900" />
//         <div className="absolute bottom-0 left-0 right-0 p-8">
//           <h1 className="text-4xl font-bold text-white mb-2">{club.name}</h1>
//           <div className="flex items-center gap-4 text-gray-300">
//             <div className="flex items-center gap-1">
//               <MapPin size={16} />
//               {club.location}
//             </div>
//             <div className="text-xl">{'€'.repeat(club.price_range)}</div>
//           </div>
//         </div>
//       </div>

//       {/* 메인 콘텐츠 */}
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* 왼쪽: 클럽 정보 */}
//           <div className="lg:col-span-2 space-y-8">
//             <div>
//               <h2 className="text-2xl font-bold text-white mb-4">About</h2>
//               <p className="text-gray-300">{club.description}</p>
//             </div>

//             {club.music_types && (
//               <div>
//                 <h2 className="text-2xl font-bold text-white mb-4">Music</h2>
//                 <div className="flex flex-wrap gap-2">
//                   {club.music_types.map((type: string) => (
//                     <span
//                       key={type}
//                       className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm"
//                     >
//                       {type}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* 오른쪽: 리뷰 섹션 */}
//           <div>
//             <Suspense fallback={<div>Loading reviews...</div>}>
//               <ReviewsSection clubId={club.id} />
//             </Suspense>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };