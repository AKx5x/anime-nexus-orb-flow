
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimeCard from '@/components/ui/anime-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import { useAnime } from '@/hooks/useAnime';
import { toast } from 'sonner';

const AnimePage = () => {
  const { data: anime, isLoading, error } = useAnime();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const genres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Romance', 'Sci-Fi', 'Supernatural'];

  const filteredAnime = anime?.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.title_english?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenres = selectedGenres.length === 0 || 
                         selectedGenres.some(genre => item.genres?.includes(genre));
    return matchesSearch && matchesGenres;
  });

  const handleWatch = (id: string) => {
    toast.success('Redirecting to watch anime...');
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
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-500">Error loading anime: {error.message}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Anime Library
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover and watch thousands of anime series
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search anime..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="mb-2">
              <Filter className="h-4 w-4 mr-2" />
              Genres:
            </Button>
            {genres.map(genre => (
              <Badge
                key={genre}
                variant={selectedGenres.includes(genre) ? "default" : "outline"}
                className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900"
                onClick={() => toggleGenre(genre)}
              >
                {genre}
              </Badge>
            ))}
          </div>
        </div>

        {/* Anime Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg aspect-[3/4] mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredAnime && filteredAnime.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredAnime.map((item) => (
              <AnimeCard
                key={item.id}
                anime={item}
                onWatch={handleWatch}
                onFavorite={handleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No anime found matching your criteria.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AnimePage;
