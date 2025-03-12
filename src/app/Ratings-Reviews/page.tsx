"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

interface Review {
  id: number;
  ride_id: number;
  reviewer_id: number;
  reviewee_id: number;
  rating: number;
  review: string;
  created_at: string;
}

export default function RatingsReviews() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      } else {
        console.error("Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const submitReview = async () => {
    if (!newReview.comment) return alert("Please enter a comment");

    // Replace these with actual IDs from your application's context
    const reviewPayload = {
      ride_id: 1,
      reviewer_id: 1,
      reviewee_id: 2,
      rating: newReview.rating,
      review: newReview.comment,
    };

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewPayload),
      });

      if (res.ok) {
        const savedReview = await res.json();
        setReviews([...reviews, savedReview]);
        setNewReview({ rating: 5, comment: "" });
      } else {
        console.error("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      );
    }
    return stars;
  };

  const [hoverRating, setHoverRating] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4D9FFF] to-[#020B3B] p-6 flex flex-col">
      {/* Back to Dashboard Button */}
      <Button 
        className="self-start mb-6 bg-[#172554] hover:bg-[#1E3A8A] text-white shadow-md rounded-full px-6 py-2 flex items-center gap-2"
        onClick={() => router.push("/dashboard")}
      >
        ← Back to Dashboard
      </Button>

      <Card className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-sm text-gray-900 shadow-xl rounded-2xl border-t border-white/50">
        <CardHeader className="bg-gradient-to-r from-[#4D9FFF] to-[#2563EB] text-white rounded-t-2xl p-6">
          <CardTitle className="text-center text-2xl font-bold">
            Ratings & Reviews
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="bg-white/20 p-4 rounded-xl border border-white/10 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-[#4D9FFF]/20 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D9FFF]">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold">User {review.reviewer_id}</p>
                        <div className="flex text-xl">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-2 pl-10">{review.review}</p>
                    <p className="text-gray-500 text-xs mt-2 pl-10">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 bg-white/10 rounded-xl border border-white/10">
                  <div className="flex justify-center mb-4">
                    <div className="bg-[#4D9FFF]/20 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D9FFF]">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-600">No reviews yet</p>
                  <p className="text-gray-500 text-sm mt-2">Be the first to share your experience!</p>
                </div>
              )}
            </div>

            {/* Submit Review Form */}
            <div className="mt-8 bg-white/30 p-5 rounded-xl border border-white/20">
              <h3 className="font-semibold text-lg mb-4">Leave a Review</h3>
              
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Rating</label>
                <div className="flex gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: num })}
                      onMouseEnter={() => setHoverRating(num)}
                      onMouseLeave={() => setHoverRating(null)}
                      className={`w-10 h-10 flex items-center justify-center rounded-full text-xl ${
                        (hoverRating !== null ? num <= hoverRating : num <= newReview.rating)
                          ? "bg-yellow-400 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Your Review</label>
                <Textarea
                  placeholder="Share your experience..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4D9FFF]"
                />
              </div>
              
              <Button
                className="w-full bg-[#E6B400] hover:bg-[#D9A900] text-black font-semibold px-6 py-3 rounded-full"
                onClick={submitReview}
              >
                Submit Review
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
