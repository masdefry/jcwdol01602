import React from 'react';
import ButtonCustom from '../button/btn';
import { ICompReview } from '@/lib/interface2';
import { rupiahFormat } from '@/lib/stringFormat';
import StarRating from './starRating';

interface ICompReviewSection {
  reviews: ICompReview[] | null;
  handleAddReview: () => void;
}

const ReviewSection = ({ reviews, handleAddReview }: ICompReviewSection) => {
  return (
    <>
      <div className="my-2 bg-gradient-to-tr from bg-fuchsia-500 to-purple-500 p-2 rounded-lg flex items-center justify-between">
        <h1 className="text-white font-semibold text-xl">Company Review</h1>
        <ButtonCustom
          btnName="Add review"
          onClick={() => {
            handleAddReview();
          }}
        />
      </div>
      {!reviews ? (
        <div className="bg-slate-200 text-center border rounded-lg p-2">
          <h1 className="text-slate-400">No Reviews</h1>
        </div>
      ) : (
        reviews.map((review) => (
          <div
            key={review.id}
            className="bg-slate-200 rounded-lg p-2 gap-2 flex flex-col"
          >
            <h1>
              <span className="text-lg font-semibold">
                {review.worker.position} Position
              </span>{' '}
              By Anonymous
            </h1>
            <div className="flex md:flex-row flex-wrap gap-2 items-center justify-center">
              {review.salary && (
                <div className="bg-white px-2 py-1 rounded-lg md:w-1/6">
                  <h2 className="font-semibold">Salary Range :</h2>
                  <p className="text-xl">± {rupiahFormat(review.salary)}</p>
                </div>
              )}

              {typeof review.career === 'number' && (
                <StarSection title="Career Rating" rating={review.career} />
              )}
              {typeof review.culture === 'number' && (
                <StarSection
                  title="Company Culture Rating"
                  rating={review.culture}
                />
              )}
              {typeof review.wlb === 'number' && (
                <StarSection
                  title="Work Life Balance Rating"
                  rating={review.wlb}
                />
              )}
              {typeof review.facility === 'number' && (
                <StarSection title="Facility Rating" rating={review.facility} />
              )}
            </div>
            {typeof review.description === 'string' && (
              <div className="bg-white px-2 py-1 rounded-lg">
                <h2 className="font-semibold">Comments :</h2>
                <p>{review.description}</p>
              </div>
            )}
          </div>
        ))
      )}
    </>
  );
};

interface IReviewSection {
  title: string;
  rating: number;
}
const StarSection = ({ title, rating }: IReviewSection) => (
  <div className="bg-white px-2 py-1 rounded-lg md:w-1/5">
    <h2 className="font-semibold">{title}:</h2>
    <StarRating rating={rating} />
  </div>
);

export default ReviewSection;
