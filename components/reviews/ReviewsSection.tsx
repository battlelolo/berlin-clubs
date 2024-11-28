// components/reviews/ReviewsSection.tsx
'use client';

import { useState } from 'react';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

interface ReviewsSectionProps {
  clubId: string;
}

export default function ReviewsSection({ clubId }: ReviewsSectionProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReviewSubmit = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Reviews</h2>
      <ReviewForm clubId={clubId} onReviewSubmit={handleReviewSubmit} />
      <ReviewList clubId={clubId} refreshTrigger={refreshTrigger} />
    </div>
  );
}