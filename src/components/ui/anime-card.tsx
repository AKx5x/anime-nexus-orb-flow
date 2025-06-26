
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Star, Bookmark, Calendar, Eye, Clock } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useNavigate } from 'react-router-dom';
import type { Tables } from '@/integrations/supabase/types';

interface AnimeCardProps {
  anime: Tables<'anime'>;
  onWatch?: (animeId: string) => void;
  onFavorite?: (id: string) => void;
}

const AnimeCard = ({ anime, onWatch, onFavorite }: AnimeCardProps) => {
  const navigate = useNavigate();

  const handleWatch = () => {
    navigate(`/anime/watch/${anime.id}`);
    onWatch?.(anime.id);
  };

  return (
    <Card className="animeil-card group cursor-pointer h-full">
      <div className="relative">
        <AspectRatio ratio={3/4}>
          <img
            src={anime.cover_image || '/placeholder.svg'}
            alt={anime.title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
        </AspectRatio>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="absolute bottom-3 left-3 right-3">
            <Button
              size="sm"
              className="animeil-button w-full"
              onClick={handleWatch}
            >
              <Play className="h-4 w-4 mr-2" />
              Watch Now
            </Button>
          </div>
        </div>

        {/* Rating badge */}
        {anime.rating && (
          <div className="absolute top-2 right-2">
            <Badge className="animeil-badge flex items-center space-x-1">
              <Star className="h-3 w-3 fill-current" />
              <span>{anime.rating}</span>
            </Badge>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-2 left-2">
          <Badge 
            className={`text-xs font-medium ${
              anime.status === 'completed' 
                ? 'status-completed' 
                : anime.status === 'ongoing'
                ? 'status-ongoing'
                : 'status-upcoming'
            }`}
          >
            {anime.status}
          </Badge>
        </div>

        {/* Episode count */}
        {anime.episode_count && (
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Badge className="animeil-badge-secondary text-xs">
              <Eye className="h-3 w-3 mr-1" />
              {anime.episode_count}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-3">
        <h3 className="font-semibold text-sm text-white mb-1 line-clamp-1 group-hover:text-red-400 transition-colors">
          {anime.title}
        </h3>
        
        {anime.title_english && anime.title_english !== anime.title && (
          <p className="text-xs text-zinc-400 mb-2 line-clamp-1">
            {anime.title_english}
          </p>
        )}
        
        <div className="flex flex-wrap gap-1 mb-2">
          {anime.genres?.slice(0, 2).map((genre) => (
            <Badge 
              key={genre} 
              className="animeil-badge-secondary text-xs"
            >
              {genre}
            </Badge>
          ))}
        </div>

        <div className="flex justify-between items-center text-xs text-zinc-500">
          <div className="flex items-center space-x-1">
            {anime.studio && <span>{anime.studio}</span>}
          </div>
          {anime.release_year && (
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{anime.release_year}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnimeCard;
