/* eslint-disable @next/next/no-img-element */

"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Library, Search, BookOpen, Star, ArrowLeft } from "lucide-react";

interface Recommendation {
  title: string;
  author: string;
  image_url: string;
  score: number;
}

export default function Recommend() {
  const [bookTitles, setBookTitles] = useState<string[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/book-titles")
      .then(response => setBookTitles(response.data))
      .catch(error => console.error("Error fetching book titles:", error));
  }, []);

  const fetchRecommendations = async () => {
    if (!selectedBook) return;
    try {
      const response = await axios.post("http://localhost:5000/api/recommend", { book_title: selectedBook });
      setRecommendations(response.data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-2">
          <Library className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold text-primary">BookGenius
          </h1>
        </div>
        <Link href="/">
          <Button variant="outline" size="lg" className="gap-2">
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Recommendation Section */}
      <Card className="mb-12 max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-6 w-6 text-primary" />
            <CardTitle>Find Similar Books</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Select value={selectedBook} onValueChange={setSelectedBook}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a book you love..." />
            </SelectTrigger>
            <SelectContent>
              {bookTitles.map((title, index) => (
                <SelectItem key={index} value={title}>{title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={fetchRecommendations}
            size="lg"
            className="gap-2"
          >
            <BookOpen className="h-5 w-5" />
            Find Recommendations
          </Button>
        </CardContent>
      </Card>

      {/* Recommendations Results */}
      {recommendations.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="h-6 w-6 text-primary" />
            <h3 className="text-2xl font-semibold">Books You Might Love</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendations.map((book, index) => (
              <Card key={index} className="hover:shadow-lg transition-all">
                <CardContent className="p-4">
                  <div className="aspect-[2/3] relative mb-4">
                    <img
                      src={book.image_url}
                      alt={book.title}
                      className="rounded-md object-cover absolute inset-0 w-full h-full"
                    />
                  </div>
                  <h4 className="font-semibold text-lg mb-2 line-clamp-2">{book.title}</h4>
                  <p className="text-muted-foreground italic mb-2">by {book.author}</p>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary fill-primary" />
                    <span className="text-sm">Match Score: {book.score}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}