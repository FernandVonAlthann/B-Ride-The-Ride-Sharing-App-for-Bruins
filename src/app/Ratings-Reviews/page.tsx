"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Review {
  user: string;
  rating: number;
  comment: string;
}

export default function RatingsReviews() {
const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    const storedReviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    setReviews(storedReviews);
  }, []);

  const submitReview = () => {
    if (!newReview.comment) return alert("Please enter a comment");
    const updatedReviews = [...reviews, { user: "You", ...newReview }];
    setReviews(updatedReviews);
    localStorage.setItem("reviews", JSON.stringify(updatedReviews));
    setNewReview({ rating: 5, comment: "" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-lg bg-white text-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Ratings & Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="border-b pb-2">
                  <p className="text-lg font-semibold">{review.user}</p>
                  <p className="text-sm text-yellow-500">⭐ {review.rating}/5</p>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No reviews yet</p>
            )}
            <div className="mt-4">
              <label className="block mb-1 text-lg">Leave a Review</label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                className="mb-2 w-full p-2 border rounded"
              >
                {[5, 4, 3, 2, 1].map((num) => (
                  <option key={num} value={num}>{num} Stars</option>
                ))}
              </select>
              <Textarea
                placeholder="Write your review..."
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              />
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2" onClick={submitReview}>Submit Review</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Button className="mt-6 bg-gray-500 hover:bg-gray-600 text-white" onClick={() => router.push("/dashboard")}>
        Back to Dashboard
      </Button>
    </div>
  );
}