
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Star, Bookmark, Calendar, Eye } from 'lucide-react';
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
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 anime-card">
      <div className="relative">
        <AspectRatio ratio={3/4}>
          <img
            src={anime.cover_image || '/placeholder.svg'}
            alt={anime.title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
        </AspectRatio>
        
        {/* Enhanced overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex space-x-2">
              <Button
                size="sm"
                className="anime-button flex-1"
                onClick={handleWatch}
              >
                <Play className="h-4 w-4 mr-2" />
                Watch Now
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onFavorite?.(anime.id)}
                className="backdrop-blur-sm bg-white/20 hover:bg-white/30 border-white/30"
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Rating badge */}
        {anime.rating && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
              <Star className="h-3 w-3 mr-1 fill-white" />
              {anime.rating}
            </Badge>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <Badge 
            variant={anime.status === 'completed' ? 'default' : 'secondary'}
            className={`capitalize backdrop-blur-sm border-0 shadow-lg ${
              anime.status === 'completed' 
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
            }`}
          >
            {anime.status}
          </Badge>
        </div>

        {/* Episode count */}
        {anime.episode_count && (
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Badge className="bg-black/60 backdrop-blur-sm text-white border-white/20">
              <Eye className="h-3 w-3 mr-1" />
              {anime.episode_count} eps
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-5">
        <h3 className="font-bold text-lg mb-2 line-clamp-1 text-white group-hover:text-purple-300 transition-colors">
          {anime.title}
        </h3>
        
        {anime.title_english && anime.title_english !== anime.title && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
            {anime.title_english}
          </p>
        )}
        
        <div className="flex flex-wrap gap-1 mb-4">
          {anime.genres?.slice(0, 3).map((genre) => (
            <Badge 
              key={genre} 
              variant="outline" 
              className="text-xs border-purple-400/30 text-purple-300 hover:bg-purple-500/20"
            >
              {genre}
            </Badge>
          ))}
        </div>

        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            {anime.studio && <span className="font-medium">{anime.studio}</span>}
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
