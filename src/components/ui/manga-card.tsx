
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Star, Bookmark, Calendar, Eye, Heart, Share } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import type { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

interface MangaCardProps {
  manga: Tables<'manga'>;
  onRead?: (mangaId: string, chapterNumber?: number) => void;
  onFavorite?: (id: string) => void;
  showRank?: boolean;
  rank?: number;
}

const MangaCard = ({ manga, onRead, onFavorite, showRank, rank }: MangaCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleReadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetails(true);
    onRead?.(manga.id);
    toast.success(`Opening ${manga.title}...`);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.(manga.id);
    toast.success(`Added ${manga.title} to favorites!`);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/manga/${manga.id}`);
    toast.success('Link copied to clipboard!');
  };

  return (
    <Card className="anime-card-brown group cursor-pointer" onClick={handleReadClick}>
      <div className="relative">
        <AspectRatio ratio={3/4}>
          <img
            src={manga.cover_image || '/placeholder.svg'}
            alt={manga.title}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        </AspectRatio>
        
        {/* Rank Badge */}
        {showRank && rank && (
          <div className="absolute -top-2 -left-2 z-20">
            <div className="w-8 h-8 bg-gradient-to-br from-gold to-copper rounded-full flex items-center justify-center text-black font-black text-sm shadow-lg">
              #{rank}
            </div>
          </div>
        )}
        
        {/* Enhanced overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex space-x-2 mb-3">
              <Button
                size="sm"
                className="brown-anime-button flex-1 text-xs font-bold"
                onClick={handleReadClick}
              >
                <BookOpen className="h-3 w-3 mr-1" />
                Read Now
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleFavorite}
                className="backdrop-blur-sm bg-white/20 hover:bg-white/30 border-white/30 p-2"
              >
                <Heart className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleShare}
                className="backdrop-blur-sm bg-white/20 hover:bg-white/30 border-white/30 p-2"
              >
                <Share className="h-3 w-3" />
              </Button>
            </div>
            
            {/* Quick Info */}
            <div className="flex items-center space-x-2 text-xs text-white/90">
              {manga.chapter_count && (
                <span className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {manga.chapter_count} chapters
                </span>
              )}
              {manga.author && (
                <>
                  <span>•</span>
                  <span className="truncate max-w-[80px]">{manga.author}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Rating badge */}
        {manga.rating && (
          <div className="absolute top-3 right-3">
            <Badge className="rating-badge-brown text-black font-bold shadow-lg">
              <Star className="h-3 w-3 mr-1 fill-current" />
              {manga.rating}
            </Badge>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <Badge 
            className={`capitalize backdrop-blur-sm border-0 shadow-lg font-bold ${
              manga.status === 'completed' 
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                : manga.status === 'ongoing'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
            }`}
          >
            {manga.status}
          </Badge>
        </div>

        {/* Popular indicator */}
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Badge className="trending-badge-brown text-white font-bold text-xs">
            POPULAR
          </Badge>
        </div>
      </div>

      <CardContent className="p-5">
        <h3 className="font-bold text-lg mb-2 line-clamp-1 text-foreground group-hover:text-primary transition-colors duration-300">
          {manga.title}
        </h3>
        
        {manga.title_english && manga.title_english !== manga.title && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-1 font-medium">
            {manga.title_english}
          </p>
        )}
        
        <div className="flex flex-wrap gap-1 mb-4">
          {manga.genres?.slice(0, 2).map((genre) => (
            <Badge 
              key={genre} 
              className="genre-badge-brown text-xs font-medium"
            >
              {genre}
            </Badge>
          ))}
          {manga.genres && manga.genres.length > 2 && (
            <Badge className="genre-badge-brown text-xs font-medium">
              +{manga.genres.length - 2}
            </Badge>
          )}
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="text-muted-foreground">
            {manga.author && (
              <span className="font-medium truncate max-w-[120px]">{manga.author}</span>
            )}
          </div>
        </div>

        {/* Additional Info */}
        {manga.chapter_count && (
          <div className="mt-2 pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground flex items-center">
              <BookOpen className="h-3 w-3 mr-1" />
              {manga.chapter_count} chapters available
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MangaCard;
