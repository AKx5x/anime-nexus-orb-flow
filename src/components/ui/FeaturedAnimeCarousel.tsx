
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Info, ChevronLeft, ChevronRight, Star, Calendar } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useNavigate } from 'react-router-dom';
import type { Tables } from '@/integrations/supabase/types';

interface FeaturedAnimeCarouselProps {
  anime: Tables<'anime'>[];
}

const FeaturedAnimeCarousel = ({ anime }: FeaturedAnimeCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % anime.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [anime.length]);

  if (!anime.length) return null;

  const currentAnime = anime[currentIndex];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % anime.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + anime.length) % anime.length);
  };

  return (
    <div className="relative w-full h-[70vh] overflow-hidden rounded-2xl">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentAnime.banner_image || currentAnime.cover_image || '/placeholder.svg'}
          alt={currentAnime.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-4 mb-4">
              <Badge className="rating-badge-brown text-black font-bold">
                <Star className="w-4 h-4 mr-1 fill-current" />
                {currentAnime.rating || 'N/A'}
              </Badge>
              <Badge variant="outline" className="brown-anime-input border-brown-light/40 text-brown-light">
                <Calendar className="w-4 h-4 mr-1" />
                {currentAnime.release_year}
              </Badge>
              <Badge className="trending-badge-brown text-white font-bold">
                FEATURED
              </Badge>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight">
              {currentAnime.title}
            </h1>

            {currentAnime.title_english && currentAnime.title_english !== currentAnime.title && (
              <p className="text-xl text-gray-300 mb-4">{currentAnime.title_english}</p>
            )}

            <p className="text-lg text-gray-200 mb-6 max-w-xl leading-relaxed">
              {currentAnime.synopsis?.substring(0, 200)}...
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {currentAnime.genres?.slice(0, 4).map((genre) => (
                <Badge key={genre} className="genre-badge-brown">
                  {genre}
                </Badge>
              ))}
            </div>

            <div className="flex space-x-4">
              <Button 
                size="lg" 
                className="brown-anime-button px-8 py-4 text-lg"
                onClick={() => navigate(`/anime/watch/${currentAnime.id}`)}
              >
                <Play className="w-6 h-6 mr-2" />
                Watch Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm"
              >
                <Info className="w-6 h-6 mr-2" />
                More Info
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"
        onClick={nextSlide}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {anime.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-primary scale-125' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedAnimeCarousel;
