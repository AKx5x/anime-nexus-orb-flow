
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Star, Bookmark, Calendar, Eye, Heart, Share } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useNavigate } from 'react-router-dom';
import type { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

interface AnimeCardProps {
  anime: Tables<'anime'>;
  onWatch?: (animeId: string) => void;
  onFavorite?: (id: string) => void;
  showRank?: boolean;
  rank?: number;
}

const AnimeCard = ({ anime, onWatch, onFavorite, showRank, rank }: AnimeCardProps) => {
  const navigate = useNavigate();

  const handleWatch = () => {
    navigate(`/anime/watch/${anime.id}`);
    onWatch?.(anime.id);
    toast.success(`Starting ${anime.title}...`);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.(anime.id);
    toast.success(`Added ${anime.title} to favorites!`);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/anime/watch/${anime.id}`);
    toast.success('Link copied to clipboard!');
  };

  return (
    <Card className="anime-card-brown group cursor-pointer" onClick={handleWatch}>
      <div className="relative">
        <AspectRatio ratio={3/4}>
          <img
            src={anime.cover_image || '/placeholder.svg'}
            alt={anime.title}
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleWatch();
                }}
              >
                <Play className="h-3 w-3 mr-1" />
                Watch Now
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
              {anime.episode_count && (
                <span className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {anime.episode_count} eps
                </span>
              )}
              {anime.release_year && (
                <span>•</span>
              )}
              {anime.release_year && (
                <span>{anime.release_year}</span>
              )}
            </div>
          </div>
        </div>

        {/* Rating badge */}
        {anime.rating && (
          <div className="absolute top-3 right-3">
            <Badge className="rating-badge-brown text-black font-bold shadow-lg">
              <Star className="h-3 w-3 mr-1 fill-current" />
              {anime.rating}
            </Badge>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <Badge 
            className={`capitalize backdrop-blur-sm border-0 shadow-lg font-bold ${
              anime.status === 'completed' 
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                : anime.status === 'ongoing'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
            }`}
          >
            {anime.status}
          </Badge>
        </div>

        {/* Trending indicator */}
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Badge className="trending-badge-brown text-white font-bold text-xs">
            TRENDING
          </Badge>
        </div>
      </div>

      <CardContent className="p-5">
        <h3 className="font-bold text-lg mb-2 line-clamp-1 text-foreground group-hover:text-primary transition-colors duration-300">
          {anime.title}
        </h3>
        
        {anime.title_english && anime.title_english !== anime.title && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-1 font-medium">
            {anime.title_english}
          </p>
        )}
        
        <div className="flex flex-wrap gap-1 mb-4">
          {anime.genres?.slice(0, 2).map((genre) => (
            <Badge 
              key={genre} 
              className="genre-badge-brown text-xs font-medium"
            >
              {genre}
            </Badge>
          ))}
          {anime.genres && anime.genres.length > 2 && (
            <Badge className="genre-badge-brown text-xs font-medium">
              +{anime.genres.length - 2}
            </Badge>
          )}
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2 text-muted-foreground">
            {anime.studio && (
              <span className="font-medium truncate max-w-[120px]">{anime.studio}</span>
            )}
          </div>
          {anime.release_year && (
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              <span className="text-xs">{anime.release_year}</span>
            </div>
          )}
        </div>

        {/* Additional Info */}
        {anime.episode_count && (
          <div className="mt-2 pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground flex items-center">
              <Play className="h-3 w-3 mr-1" />
              {anime.episode_count} episodes available
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnimeCard;
