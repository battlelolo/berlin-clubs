// components/reviews/ReviewList.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Star, MoreVertical, Pencil, Trash2 } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
  profiles?: {
    username: string;
    avatar_url: string;
  };
}

interface ReviewListProps {
  clubId: string;
  refreshTrigger?: number;
}

export default function ReviewList({ clubId, refreshTrigger }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const supabase = createClient();

  // 현재 사용자 정보 가져오기
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user?.id || null);
    };
    getUser();
  }, []);

  const fetchReviews = async () => {
    try {
      console.log('Fetching reviews for club:', clubId);
      setLoading(true);
  
      // 먼저 리뷰만 가져오기
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('club_id', clubId)
        .order('created_at', { ascending: false });
  
      console.log('Reviews data:', reviewsData);
      console.log('Reviews error:', reviewsError);
  
      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError);
        return;
      }
  
      if (reviewsData) {
        // 각 리뷰에 대한 프로필 정보 가져오기
        const reviewsWithProfiles = await Promise.all(
          reviewsData.map(async (review) => {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('username, avatar_url')
              .eq('id', review.user_id)
              .single();
  
            return {
              ...review,
              profiles: profileData || {
                username: 'Anonymous',
                avatar_url: null
              }
            };
          })
        );
  
        console.log('Reviews with profiles:', reviewsWithProfiles);
        setReviews(reviewsWithProfiles);
      }
    } catch (error) {
      console.error('Error in fetchReviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [clubId, refreshTrigger]);

  // 리뷰 수정
  const handleEdit = (review: Review) => {
    setEditingReview(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
    setMenuOpenId(null);
  };

  // 리뷰 수정 저장
  const handleUpdateReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({
          rating: editRating,
          comment: editComment,
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewId)
        .eq('user_id', currentUser); // 보안을 위해 현재 사용자 확인

      if (error) throw error;
      
      setEditingReview(null);
      await fetchReviews();
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  // 리뷰 삭제
  const handleDelete = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .eq('user_id', currentUser); // 보안을 위해 현재 사용자 확인

      if (error) throw error;
      
      await fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
    setMenuOpenId(null);
  };

  if (loading) {
    return <div className="text-center py-4">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-4 text-gray-400">
        No reviews yet. Be the first to review!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-zinc-800 rounded-lg p-4">
          {editingReview === review.id ? (
            // 수정 폼
            <div className="space-y-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setEditRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= editRating
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-700 text-white rounded-lg"
                rows={4}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditingReview(null)}
                  className="px-3 py-1 text-sm bg-zinc-700 rounded-lg hover:bg-zinc-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateReview(review.id)}
                  className="px-3 py-1 text-sm bg-purple-500 rounded-lg hover:bg-purple-600"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            // 리뷰 표시
            <>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <img
                    src={review.profiles?.avatar_url || `/api/placeholder/32/32`}
                    alt={review.profiles?.username || 'Anonymous'}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="font-medium">
                      {review.profiles?.username || 'Anonymous'}
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-yellow-500 text-yellow-500'
                              : 'text-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {currentUser === review.user_id && (
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpenId(menuOpenId === review.id ? null : review.id)}
                      className="p-1 hover:bg-zinc-700 rounded-full"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {menuOpenId === review.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-zinc-700 rounded-lg shadow-lg py-1 z-10">
                        <button
                          onClick={() => handleEdit(review)}
                          className="w-full px-4 py-2 text-left hover:bg-zinc-600 flex items-center gap-2"
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="w-full px-4 py-2 text-left hover:bg-zinc-600 text-red-400 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-gray-300 mt-3">{review.comment}</p>
              <div className="text-sm text-gray-400 mt-2">
                {new Date(review.created_at).toLocaleDateString()}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}