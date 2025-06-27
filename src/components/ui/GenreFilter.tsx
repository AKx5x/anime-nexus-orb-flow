
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

interface GenreFilterProps {
  genres: string[];
  selectedGenres: string[];
  onGenreToggle: (genre: string) => void;
  onClearAll: () => void;
}

const GenreFilter = ({ genres, selectedGenres, onGenreToggle, onClearAll }: GenreFilterProps) => {
  return (
    <div className="brown-glass-card p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Filter by Genre</h3>
        </div>
        {selectedGenres.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {genres.map(genre => (
          <Badge
            key={genre}
            variant={selectedGenres.includes(genre) ? "default" : "outline"}
            className={`cursor-pointer transition-all duration-300 ${
              selectedGenres.includes(genre)
                ? 'brown-anime-gradient text-white shadow-lg scale-105'
                : 'genre-badge-brown hover:scale-105'
            }`}
            onClick={() => onGenreToggle(genre)}
          >
            {genre}
          </Badge>
        ))}
      </div>
      
      {selectedGenres.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing content for: {selectedGenres.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default GenreFilter;
