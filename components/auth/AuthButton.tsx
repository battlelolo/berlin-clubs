'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { UserCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

export default function AuthButton() {
  const router = useRouter();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user || null);
    };

    fetchUser();

    // 인증 상태 변경 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      router.refresh();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {loading ? (
        <div className="w-8 h-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 p-2 rounded-full hover:bg-zinc-800 transition-colors"
        >
          {user ? (
            <div className="flex items-center gap-2">
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <UserCircle className="w-8 h-8" />
              )}
              <span className="text-sm">{user.user_metadata?.full_name || user.email}</span>
            </div>
          ) : (
            <UserCircle className="w-8 h-8" />
          )}
        </button>
      )}
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-zinc-800 rounded-lg shadow-lg py-1 z-50">
          {user ? (
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-700"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={handleSignIn}
              className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-700"
            >
              Sign In (Google)
            </button>
          )}
        </div>
      )}
    </div>
  );
}