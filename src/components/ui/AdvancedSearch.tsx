
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onReset: () => void;
}

interface SearchFilters {
  query: string;
  genres: string[];
  status: string;
  rating: number[];
  year: string;
  studio: string;
  sortBy: string;
}

const AdvancedSearch = ({ onSearch, onReset }: AdvancedSearchProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    genres: [],
    status: '',
    rating: [0],
    year: '',
    studio: '',
    sortBy: 'popularity'
  });

  const genres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Romance', 
    'Sci-Fi', 'Supernatural', 'Thriller', 'Mystery', 'Horror', 'Slice of Life'
  ];

  const handleGenreToggle = (genre: string) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      query: '',
      genres: [],
      status: '',
      rating: [0],
      year: '',
      studio: '',
      sortBy: 'popularity'
    });
    onReset();
  };

  return (
    <Card className="brown-glass-card mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-xl font-bold">
            <Search className="w-5 h-5 mr-2 text-primary" />
            Advanced Search
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground hover:text-foreground"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            {isExpanded ? 'Simple' : 'Advanced'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Basic Search */}
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search anime, manga, or characters..."
              value={filters.query}
              onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              className="brown-anime-input pl-10"
            />
          </div>
          <Button onClick={handleSearch} className="brown-anime-button">
            Search
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="space-y-6 pt-4 border-t border-border">
            {/* Genres */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Genres
              </label>
              <div className="flex flex-wrap gap-2">
                {genres.map(genre => (
                  <Badge
                    key={genre}
                    variant={filters.genres.includes(genre) ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-300 ${
                      filters.genres.includes(genre)
                        ? 'brown-anime-gradient text-white shadow-lg'
                        : 'genre-badge-brown hover:scale-105'
                    }`}
                    onClick={() => handleGenreToggle(genre)}
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Status
                </label>
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="brown-anime-input">
                    <SelectValue placeholder="Any status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any status</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Year
                </label>
                <Select value={filters.year} onValueChange={(value) => setFilters(prev => ({ ...prev, year: value }))}>
                  <SelectTrigger className="brown-anime-input">
                    <SelectValue placeholder="Any year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any year</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                    <SelectItem value="2020">2020</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Studio
                </label>
                <Input
                  placeholder="Studio name"
                  value={filters.studio}
                  onChange={(e) => setFilters(prev => ({ ...prev, studio: e.target.value }))}
                  className="brown-anime-input"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Sort By
                </label>
                <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                  <SelectTrigger className="brown-anime-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Rating Slider */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Minimum Rating: {filters.rating[0]}/10
              </label>
              <Slider
                value={filters.rating}
                onValueChange={(value) => setFilters(prev => ({ ...prev, rating: value }))}
                max={10}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedSearch;
