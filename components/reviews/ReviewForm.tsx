// components/reviews/ReviewForm.tsx
'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface ReviewFormProps {
  clubId: string;
  onReviewSubmit: () => void;
}

export default function ReviewForm({ clubId, onReviewSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('reviews')
      .insert({
        club_id: clubId,
        user_id: user.id,
        rating,
        comment
      });

    if (!error) {
      setRating(0);
      setComment('');
      onReviewSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-zinc-800 rounded-lg">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            className="focus:outline-none"
          >
            <Star
              className={`w-8 h-8 ${
                star <= (hoveredStar || rating)
                  ? 'fill-yellow-500 text-yellow-500'
                  : 'text-gray-400'
              }`}
            />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience..."
        className="w-full px-3 py-2 bg-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        rows={4}
      />

      <button
        type="submit"
        disabled={rating === 0 || !comment}
        className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600 transition-colors"
      >
        Submit Review
      </button>
    </form>
  );
}