
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
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 anime-card">
        <div className="relative">
          <AspectRatio ratio={3/4}>
            <img
              src={manga.cover_image || '/placeholder.svg'}
              alt={manga.title}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </AspectRatio>
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex space-x-2">
              <Button
                size="sm"
                className="anime-button"
                onClick={handleReadClick}
              >
                <BookOpen className="h-4 w-4 mr-1" />
                Read
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onFavorite?.(manga.id)}
                className="backdrop-blur-sm bg-white/20 hover:bg-white/30"
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Rating badge */}
          {manga.rating && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-black/70 text-white hover:bg-black/70">
                <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                {manga.rating}
              </Badge>
            </div>
          )}

          {/* Status badge */}
          <div className="absolute top-2 left-2">
            <Badge 
              variant={manga.status === 'completed' ? 'default' : 'secondary'}
              className="capitalize backdrop-blur-sm"
            >
              {manga.status}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{manga.title}</h3>
          {manga.title_english && manga.title_english !== manga.title && (
            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{manga.title_english}</p>
          )}
          
          <div className="flex flex-wrap gap-1 mb-3">
            {manga.genres?.slice(0, 3).map((genre) => (
              <Badge key={genre} variant="outline" className="text-xs">
                {genre}
              </Badge>
            ))}
          </div>

          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{manga.author}</span>
          </div>
          
          {manga.chapter_count && (
            <p className="text-xs text-muted-foreground mt-1">
              {manga.chapter_count} chapters
            </p>
          )}
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
