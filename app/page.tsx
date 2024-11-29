// app/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import ClubGrid from '@/components/ClubGrid';

interface Club {
  id: string;
  name: string;
  image_url: string;
}

async function getClubs() {
  const supabase = createServerComponentClient({ cookies });
  const { data: clubs } = await supabase
    .from('clubs')
    .select('*');

  return clubs as Club[];
}

export default async function Home() {
  const clubs = await getClubs();
  
  return (
    <main className="min-h-screen bg-zinc-900">
      <div className="container mx-auto px-4 py-8">
        <ClubGrid clubs={clubs} />
      </div>
    </main>
  );
}

// // app/page.tsx
// import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
// import { cookies } from 'next/headers';
// import { Suspense } from 'react';
// import MainClientWrapper from '@/components/MainClientWrapper';

// export default async function Home() {
//   const supabase = createServerComponentClient({ cookies });
  
//   const { data: clubs } = await supabase
//     .from('clubs')
//     .select('*');

//   return (
//     <div className="flex flex-col h-[calc(100vh-64px)]">
//       <Suspense fallback={<div>Loading...</div>}>
//         <MainClientWrapper clubs={clubs || []} />
//       </Suspense>
//     </div>
//   );
// }