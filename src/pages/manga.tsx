
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MangaCard from '@/components/ui/manga-card';
import AdvancedSearch from '@/components/ui/AdvancedSearch';
import GenreFilter from '@/components/ui/GenreFilter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid, List, Filter, SortAsc, BookOpen, TrendingUp } from 'lucide-react';
import { useManga } from '@/hooks/useManga';
import { toast } from 'sonner';

const MangaPage = () => {
  const { data: manga, isLoading, error } = useManga();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popularity');
  const [filterStatus, setFilterStatus] = useState('all');

  const genres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Romance', 'Sci-Fi', 'Martial Arts', 'Mystery', 'Horror'];

  const filteredManga = manga?.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.title_english?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenres = selectedGenres.length === 0 || 
                         selectedGenres.some(genre => item.genres?.includes(genre));
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesGenres && matchesStatus;
  })?.sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return (b.rating || 0) - (a.rating || 0);
    }
  });

  const handleRead = (id: string) => {
    toast.success('Opening manga reader...');
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

  const handleSearch = (filters: any) => {
    setSearchTerm(filters.query);
    setSelectedGenres(filters.genres);
    setSortBy(filters.sortBy);
    toast.success('Search filters applied!');
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedGenres([]);
    setSortBy('popularity');
    setFilterStatus('all');
    toast.success('Filters reset!');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="brown-glass-card p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-destructive mb-4">Oops! Something went wrong</h2>
              <p className="text-muted-foreground mb-6">We couldn't load the manga collection. Please try again later.</p>
              <Button onClick={() => window.location.reload()} className="brown-anime-button">
                Try Again
              </Button>
            </div>
          </div>
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
        <div className="mb-12 text-center">
          <h1 className="brown-anime-title mb-6">
            Manga Library
          </h1>
          <p className="brown-anime-subtitle max-w-3xl mx-auto">
            Dive into the world of manga with our extensive collection. From action-packed adventures 
            to heartwarming romances, find your next favorite read.
          </p>
        </div>

        {/* Advanced Search */}
        <AdvancedSearch onSearch={handleSearch} onReset={handleReset} />

        {/* Genre Filter */}
        <GenreFilter 
          genres={genres}
          selectedGenres={selectedGenres}
          onGenreToggle={toggleGenre}
          onClearAll={() => setSelectedGenres([])}
        />

        {/* Toolbar */}
        <div className="brown-glass-card p-4 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Status:</span>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <SortAsc className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Sort:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Popular</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="title">A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {filteredManga?.length || 0} results
              </span>
              <div className="flex items-center space-x-1 border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="p-2"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="p-2"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="brown-anime-pulse rounded-xl aspect-[3/4] mb-4"></div>
            ))}
          </div>
        ) : filteredManga && filteredManga.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6" 
            : "space-y-4"
          }>
            {filteredManga.map((item, index) => (
              <MangaCard
                key={item.id}
                manga={item}
                onRead={handleRead}
                onFavorite={handleFavorite}
                showRank={sortBy === 'popularity' || sortBy === 'rating'}
                rank={index + 1}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="brown-glass-card p-12 max-w-md mx-auto">
              <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-foreground mb-4">No manga found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search criteria or browse our popular titles.
              </p>
              <Button onClick={handleReset} className="brown-anime-button">
                <BookOpen className="w-4 h-4 mr-2" />
                Browse All Manga
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MangaPage;
