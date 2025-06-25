
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Star, Bookmark } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import type { Tables } from '@/integrations/supabase/types';

interface AnimeCardProps {
  anime: Tables<'anime'>;
  onWatch?: (id: string) => void;
  onFavorite?: (id: string) => void;
}

const AnimeCard = ({ anime, onWatch, onFavorite }: AnimeCardProps) => {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        <AspectRatio ratio={3/4}>
          <img
            src={anime.cover_image || '/placeholder.svg'}
            alt={anime.title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        </AspectRatio>
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-2">
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              onClick={() => onWatch?.(anime.id)}
            >
              <Play className="h-4 w-4 mr-1" />
              Watch
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onFavorite?.(anime.id)}
            >
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Rating badge */}
        <div className="absolute top-2 right-2">
          <Badge className="bg-black/70 text-white hover:bg-black/70">
            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
            {anime.rating}
          </Badge>
        </div>

        {/* Status badge */}
        <div className="absolute top-2 left-2">
          <Badge 
            variant={anime.status === 'completed' ? 'default' : 'secondary'}
            className="capitalize"
          >
            {anime.status}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{anime.title}</h3>
        {anime.title_english && anime.title_english !== anime.title && (
          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{anime.title_english}</p>
        )}
        
        <div className="flex flex-wrap gap-1 mb-3">
          {anime.genres?.slice(0, 3).map((genre) => (
            <Badge key={genre} variant="outline" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>

        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>{anime.studio}</span>
          <span>{anime.release_year}</span>
        </div>
        
        {anime.episode_count && (
          <p className="text-xs text-muted-foreground mt-1">
            {anime.episode_count} episodes
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AnimeCard;
