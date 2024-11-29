// app/layout.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Header from '@/components/Header';
import 'mapbox-gl/dist/mapbox-gl.css';
import './globals.css';

export const dynamic = 'force-dynamic';

// async function getSupabase() {
//   const cookieStore = await cookies();
//   return createServerComponentClient({ cookies: () => cookieStore });
// }

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const supabase = await getSupabase();

  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Header />
        <main className="min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </body>
    </html>
  );
}