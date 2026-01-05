"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, User, Ticket } from "lucide-react";
import Link from "next/link";

// Mock events data for selection
const mockEvents = [
  {
    id: 1,
    title: "Tech Conference 2025",
    date: "2025-03-15",
    location: "Jakarta Convention Center",
  },
  {
    id: 2,
    title: "Music Festival",
    date: "2025-04-20",
    location: "Gelora Bung Karno Stadium",
  },
  { id: 3, title: "Food Expo", date: "2025-05-10", location: "ICE BSD City" },
  {
    id: 4,
    title: "Art Exhibition",
    date: "2025-06-05",
    location: "National Gallery",
  },
  {
    id: 5,
    title: "Business Summit",
    date: "2025-07-12",
    location: "Grand Hyatt Jakarta",
  },
  {
    id: 6,
    title: "Sports Championship",
    date: "2025-08-18",
    location: "Senayan Sports Complex",
  },
];

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    eventId: 1,
    userName: "Sarah Johnson",
    rating: 5,
    review:
      "Amazing conference! The speakers were incredibly knowledgeable and the networking opportunities were fantastic. Highly recommend for anyone in tech.",
    date: "2025-01-15",
    verified: true,
  },
  {
    id: 2,
    eventId: 1,
    userName: "Michael Chen",
    rating: 4,
    review:
      "Great content and well-organized event. The venue was perfect and the food was excellent. Only minor issue was the WiFi connectivity.",
    date: "2025-01-14",
    verified: true,
  },
  {
    id: 3,
    eventId: 2,
    userName: "Emma Wilson",
    rating: 5,
    review:
      "Incredible music festival! The lineup was amazing and the sound quality was perfect. The atmosphere was electric throughout the entire event.",
    date: "2025-01-10",
    verified: true,
  },
  {
    id: 4,
    eventId: 2,
    userName: "David Rodriguez",
    rating: 4,
    review:
      "Fantastic performances and great organization. The food vendors were diverse and delicious. Could use more seating areas.",
    date: "2025-01-08",
    verified: false,
  },
  {
    id: 5,
    eventId: 3,
    userName: "Lisa Thompson",
    rating: 5,
    review:
      "Food expo was incredible! So many amazing vendors and the variety was outstanding. Learned so much about different cuisines.",
    date: "2025-01-05",
    verified: true,
  },
];

export default function ReviewAndRatingPage() {
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [filterEventId, setFilterEventId] = useState<string>("all");

  const handleStarClick = (starValue: number) => {
    setRating(starValue);
  };

  const handleStarHover = (starValue: number) => {
    setHoverRating(starValue);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !rating || !reviewText.trim() || !userName.trim()) {
      alert("Please fill in all fields and provide a rating");
      return;
    }

    // Here you would typically send the review to your backend
    console.log("Review submitted:", {
      eventId: selectedEvent,
      userName,
      rating,
      review: reviewText,
      date: new Date().toISOString().split("T")[0],
    });

    alert("Review submitted successfully!");

    // Reset form
    setSelectedEvent("");
    setRating(0);
    setReviewText("");
    setUserName("");
  };

  const filteredReviews =
    filterEventId === "all"
      ? mockReviews
      : mockReviews.filter(
          (review) => review.eventId === Number.parseInt(filterEventId)
        );

  const getEventTitle = (eventId: number) => {
    const event = mockEvents.find((e) => e.id === eventId);
    return event ? event.title : "Unknown Event";
  };

  const getAverageRating = (eventId: number) => {
    const eventReviews = mockReviews.filter(
      (review) => review.eventId === eventId
    );
    if (eventReviews.length === 0) return 0;
    const sum = eventReviews.reduce((acc, review) => acc + review.rating, 0);
    return parseFloat((sum / eventReviews.length).toFixed(1));
  };

  const getReviewCount = (eventId: number) => {
    return mockReviews.filter((review) => review.eventId === eventId).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Ticket className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">EventUp</span>
            </Link>
            <nav className="flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Back to Home
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Reviews & Ratings
            </h1>
            <p className="text-xl text-gray-600">
              Share your event experience and read what others have to say
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Review Form */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Write a Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitReview} className="space-y-6">
                  <div>
                    <Label htmlFor="userName">Your Name</Label>
                    <Input
                      id="userName"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="event">Select Event</Label>
                    <Select
                      value={selectedEvent}
                      onValueChange={setSelectedEvent}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Choose an event to review" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockEvents.map((event) => (
                          <SelectItem
                            key={event.id}
                            value={event.id.toString()}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{event.title}</span>
                              <span className="text-sm text-gray-500">
                                {event.date} • {event.location}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Rating</Label>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleStarClick(star)}
                          onMouseEnter={() => handleStarHover(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 transition-colors"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= (hoverRating || rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {rating > 0 && `${rating} star${rating > 1 ? "s" : ""}`}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="review">Your Review</Label>
                    <Textarea
                      id="review"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your experience about this event..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Submit Review
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Reviews List */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Event Reviews
                </h2>
                <Select value={filterEventId} onValueChange={setFilterEventId}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    {mockEvents.map((event) => (
                      <SelectItem key={event.id} value={event.id.toString()}>
                        {event.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Event Statistics */}
              {filterEventId !== "all" && (
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {getEventTitle(Number.parseInt(filterEventId))}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => {
                              const average =
                                filterEventId !== "all"
                                  ? getAverageRating(
                                      Number.parseInt(filterEventId)
                                    )
                                  : 0;

                              return (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= average
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              );
                            })}
                          </div>
                          <span className="text-sm text-gray-600">
                            {getAverageRating(Number.parseInt(filterEventId))} (
                            {getReviewCount(Number.parseInt(filterEventId))}{" "}
                            reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-900">
                                {review.userName}
                              </h4>
                              {review.verified && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  Verified
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {review.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {filterEventId === "all" && (
                        <div className="mb-3">
                          <span className="text-sm font-medium text-blue-600">
                            {getEventTitle(review.eventId)}
                          </span>
                        </div>
                      )}

                      <p className="text-gray-700 leading-relaxed">
                        {review.review}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredReviews.length === 0 && (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-gray-500">
                      No reviews found for the selected event.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
