
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimeCard from '@/components/ui/anime-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Star, Calendar, TrendingUp } from 'lucide-react';
import { useAnime } from '@/hooks/useAnime';
import { toast } from 'sonner';

const AnimePage = () => {
  const { data: anime, isLoading, error } = useAnime();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const genres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Romance', 'Sci-Fi', 'Supernatural', 'Thriller', 'Horror'];

  const filteredAnime = anime?.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.title_english?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenres = selectedGenres.length === 0 || 
                         selectedGenres.some(genre => item.genres?.includes(genre));
    return matchesSearch && matchesGenres;
  });

  const handleWatch = (id: string) => {
    toast.success('Opening anime player...');
  };

  const handleFavorite = (id: string) => {
    toast.success('Added to favorites!');
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-900">
        <Header />
        <div className="animeil-container py-16">
          <div className="text-center text-red-400 text-lg">Error loading anime: {error.message}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <Header />
      
      <main className="animeil-container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-8 h-8 text-red-500" />
            <h1 className="text-4xl font-bold text-white">
              Anime Library
            </h1>
          </div>
          <p className="text-zinc-400 text-lg">
            Discover and stream thousands of anime series in HD quality
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-5 w-5" />
            <Input
              placeholder="Search anime titles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="animeil-input pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2 text-white">
              <Filter className="h-5 w-5 text-red-500" />
              <span className="font-medium">Genres:</span>
            </div>
            {genres.map(genre => (
              <Badge
                key={genre}
                className={`cursor-pointer transition-all ${
                  selectedGenres.includes(genre) 
                    ? 'animeil-badge' 
                    : 'animeil-badge-secondary hover:bg-zinc-600'
                }`}
                onClick={() => toggleGenre(genre)}
              >
                {genre}
              </Badge>
            ))}
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="animeil-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animeil-card animeil-pulse">
                <div className="aspect-[3/4] bg-zinc-800 mb-3"></div>
                <div className="p-3">
                  <div className="h-4 bg-zinc-800 rounded mb-2"></div>
                  <div className="h-3 bg-zinc-800 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredAnime && filteredAnime.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-zinc-400">
                Showing {filteredAnime.length} anime{filteredAnime.length !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center space-x-2 text-zinc-400">
                <Star className="h-4 w-4" />
                <span className="text-sm">Sorted by rating</span>
              </div>
            </div>
            <div className="animeil-grid">
              {filteredAnime.map((item) => (
                <AnimeCard
                  key={item.id}
                  anime={item}
                  onWatch={handleWatch}
                  onFavorite={handleFavorite}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Anime Found</h3>
            <p className="text-zinc-400 text-lg">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AnimePage;
