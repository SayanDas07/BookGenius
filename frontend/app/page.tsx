/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Library, TrendingUp, Star, Users, Compass } from "lucide-react";

interface Book {
  "Book-Title": string;
  "Book-Author": string;
  "Image-URL-M": string;
  avg_rating: number;
  num_of_ratings: number;
}

export default function Home() {
  const [popularBooks, setPopularBooks] = useState<Book[]>([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/popular-books")
      .then(response => setPopularBooks(response.data))
      .catch(error => console.error("Error fetching popular books:", error));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-2">
          <Library className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold text-primary">BookGenius
          </h1>
        </div>
        <Link href="/recommend">
          <Button size="lg" className="gap-2">
            <Compass className="h-5 w-5" />
            Find Your Right Book
          </Button>
        </Link>
      </div>
      <p className="text-muted-foreground text-center mb-12">Your personal guide to discovering amazing books</p>

      {/* Popular Books Section */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">Top 50 Trending Books</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularBooks.map((book, index) => (
            <Card key={index} className="hover:shadow-lg transition-all">
              <CardContent className="p-4">
                <div className="aspect-[2/3] relative mb-4">
                  <img
                    src={book["Image-URL-M"]}
                    alt={book["Book-Title"]}
                    className="rounded-md object-cover absolute inset-0 w-full h-full"
                  />
                </div>
                <h4 className="font-semibold text-lg mb-2 line-clamp-2">{book["Book-Title"]}</h4>
                <p className="text-muted-foreground italic mb-2">by {book["Book-Author"]}</p>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm">{book.avg_rating.toFixed(2)}</span>
                  <Users className="h-4 w-4 text-muted-foreground ml-2" />
                  <span className="text-sm text-muted-foreground">
                    {book.num_of_ratings.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}