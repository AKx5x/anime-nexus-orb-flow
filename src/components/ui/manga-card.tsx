
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Star, Bookmark, Calendar } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import type { Tables } from '@/integrations/supabase/types';
import MangaDetailsDialog from './MangaDetailsDialog';

interface MangaCardProps {
  manga: Tables<'manga'>;
  onRead?: (mangaId: string, chapterNumber?: number) => void;
  onFavorite?: (id: string) => void;
}

const MangaCard = ({ manga, onRead, onFavorite }: MangaCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleReadClick = () => {
    setShowDetails(true);
  };

  return (
    <>
      <Card className="animeil-card group cursor-pointer h-full">
        <div className="relative">
          <AspectRatio ratio={3/4}>
            <img
              src={manga.cover_image || '/placeholder.svg'}
              alt={manga.title}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            />
          </AspectRatio>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="absolute bottom-3 left-3 right-3">
              <Button
                size="sm"
                className="animeil-button w-full"
                onClick={handleReadClick}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Read Now
              </Button>
            </div>
          </div>

          {/* Rating badge */}
          {manga.rating && (
            <div className="absolute top-2 right-2">
              <Badge className="animeil-badge flex items-center space-x-1">
                <Star className="h-3 w-3 fill-current" />
                <span>{manga.rating}</span>
              </Badge>
            </div>
          )}

          {/* Status badge */}
          <div className="absolute top-2 left-2">
            <Badge 
              className={`text-xs font-medium ${
                manga.status === 'completed' 
                  ? 'status-completed' 
                  : manga.status === 'ongoing'
                  ? 'status-ongoing'
                  : 'status-upcoming'
              }`}
            >
              {manga.status}
            </Badge>
          </div>
        </div>

        <CardContent className="p-3">
          <h3 className="font-semibold text-sm text-white mb-1 line-clamp-1 group-hover:text-red-400 transition-colors">
            {manga.title}
          </h3>
          
          {manga.title_english && manga.title_english !== manga.title && (
            <p className="text-xs text-zinc-400 mb-2 line-clamp-1">
              {manga.title_english}
            </p>
          )}
          
          <div className="flex flex-wrap gap-1 mb-2">
            {manga.genres?.slice(0, 2).map((genre) => (
              <Badge 
                key={genre} 
                className="animeil-badge-secondary text-xs"
              >
                {genre}
              </Badge>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-zinc-500">
            <span>{manga.author}</span>
            {manga.chapter_count && (
              <span>{manga.chapter_count} ch</span>
            )}
          </div>
        </CardContent>
      </Card>

      <MangaDetailsDialog
        manga={manga}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        onRead={onRead}
      />
    </>
  );
};

export default MangaCard;
