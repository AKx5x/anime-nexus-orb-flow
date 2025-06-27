
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
    <div className="search-container mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-black">Filter by Genre</h3>
        </div>
        {selectedGenres.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-gray-500 hover:text-gray-700"
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
            className={`cursor-pointer transition-all duration-200 ${
              selectedGenres.includes(genre)
                ? 'genre-badge selected'
                : 'genre-badge'
            }`}
            onClick={() => onGenreToggle(genre)}
          >
            {genre}
          </Badge>
        ))}
      </div>
      
      {selectedGenres.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing content for: <span className="font-medium text-red-500">{selectedGenres.join(', ')}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default GenreFilter;
