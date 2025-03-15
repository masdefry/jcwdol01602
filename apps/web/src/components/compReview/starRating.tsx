import React from 'react';

interface StarRatingProps {
  rating: number | null;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const safeRating = rating ?? 0;

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-xl ${
            star <= safeRating ? 'text-yellow-500' : 'text-gray-400'
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
