// app/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import MainClientWrapper from '@/components/MainClientWrapper';

async function getClubs() {
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({
    cookies: () => cookieStore
  });
  
  const { data: clubs } = await supabase
    .from('clubs')
    .select('*');
  return clubs || [];
}

export default async function Home() {
  const clubs = await getClubs();

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <Suspense fallback={<div>Loading...</div>}>
        <MainClientWrapper clubs={clubs} />
      </Suspense>
    </div>
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