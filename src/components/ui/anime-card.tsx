
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Star, Heart, Share, Calendar, Eye } from 'lucide-react';
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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'ongoing':
        return 'status-ongoing';
      case 'upcoming':
        return 'status-upcoming';
      default:
        return 'bg-gray-500 text-white px-2 py-1 rounded text-xs font-medium';
    }
  };

  return (
    <Card className="anime-card-clean group cursor-pointer" onClick={handleWatch}>
      <div className="relative">
        <AspectRatio ratio={3/4}>
          <img
            src={anime.cover_image || '/placeholder.svg'}
            alt={anime.title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </AspectRatio>
        
        {/* Rank Badge */}
        {showRank && rank && (
          <div className="absolute -top-2 -left-2 z-20">
            <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
              #{rank}
            </div>
          </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex space-x-2 mb-3">
              <Button
                size="sm"
                className="btn-red flex-1 text-xs font-bold"
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
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 p-2"
                onClick={handleFavorite}
              >
                <Heart className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 p-2"
                onClick={handleShare}
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
                <>
                  <span>•</span>
                  <span>{anime.release_year}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Rating badge */}
        {anime.rating && (
          <div className="absolute top-3 right-3">
            <Badge className="rating-badge shadow-lg">
              <Star className="h-3 w-3 mr-1 fill-current" />
              {anime.rating}
            </Badge>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <Badge className={`${getStatusBadgeClass(anime.status)} capitalize shadow-lg`}>
            {anime.status}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-1 text-black group-hover:text-red-500 transition-colors">
          {anime.title}
        </h3>
        
        {anime.title_english && anime.title_english !== anime.title && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-1 font-medium">
            {anime.title_english}
          </p>
        )}
        
        <div className="flex flex-wrap gap-1 mb-3">
          {anime.genres?.slice(0, 2).map((genre) => (
            <Badge 
              key={genre} 
              className="genre-badge text-xs"
            >
              {genre}
            </Badge>
          ))}
          {anime.genres && anime.genres.length > 2 && (
            <Badge className="genre-badge text-xs">
              +{anime.genres.length - 2}
            </Badge>
          )}
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            {anime.studio && (
              <span className="font-medium truncate max-w-[120px]">{anime.studio}</span>
            )}
          </div>
          {anime.release_year && (
            <div className="flex items-center text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              <span className="text-xs">{anime.release_year}</span>
            </div>
          )}
        </div>

        {/* Additional Info */}
        {anime.episode_count && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 flex items-center">
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
