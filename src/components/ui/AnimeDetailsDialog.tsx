
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Star, Calendar, Clock, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import VideoPlayer from '@/components/player/VideoPlayer';

interface AnimeDetailsDialogProps {
  anime: Tables<'anime'>;
  isOpen: boolean;
  onClose: () => void;
  onWatch?: (animeId: string, seasonId?: string, episodeId?: string) => void;
}

const AnimeDetailsDialog: React.FC<AnimeDetailsDialogProps> = ({
  anime,
  isOpen,
  onClose,
  onWatch
}) => {
  const [seasons, setSeasons] = useState<any[]>([]);
  const [episodes, setEpisodes] = useState<{ [key: string]: any[] }>({});
  const [loading, setLoading] = useState(true);
  const [selectedEpisode, setSelectedEpisode] = useState<any>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    if (isOpen && anime.id) {
      fetchSeasonsAndEpisodes();
    }
  }, [isOpen, anime.id]);

  const fetchSeasonsAndEpisodes = async () => {
    setLoading(true);
    
    // Fetch seasons
    const { data: seasonsData, error: seasonsError } = await supabase
      .from('seasons')
      .select('*')
      .eq('anime_id', anime.id)
      .order('season_number');

    if (!seasonsError && seasonsData) {
      setSeasons(seasonsData);
      
      // Fetch episodes for each season
      const episodePromises = seasonsData.map(async (season) => {
        const { data: episodesData, error: episodesError } = await supabase
          .from('episodes')
          .select('*')
          .eq('season_id', season.id)
          .order('episode_number');
        
        return { seasonId: season.id, episodes: episodesData || [] };
      });
      
      const episodeResults = await Promise.all(episodePromises);
      const episodeMap: { [key: string]: any[] } = {};
      
      episodeResults.forEach(({ seasonId, episodes }) => {
        episodeMap[seasonId] = episodes;
      });
      
      setEpisodes(episodeMap);
    }
    
    setLoading(false);
  };

  const handleEpisodeClick = (episode: any) => {
    if (episode.google_drive_link) {
      setSelectedEpisode(episode);
      setShowPlayer(true);
      onWatch?.(anime.id, episode.season_id, episode.id);
    }
  };

  const getNextEpisode = () => {
    if (!selectedEpisode) return null;
    const seasonEpisodes = episodes[selectedEpisode.season_id] || [];
    const currentIndex = seasonEpisodes.findIndex(ep => ep.id === selectedEpisode.id);
    return currentIndex < seasonEpisodes.length - 1 ? seasonEpisodes[currentIndex + 1] : null;
  };

  const getPreviousEpisode = () => {
    if (!selectedEpisode) return null;
    const seasonEpisodes = episodes[selectedEpisode.season_id] || [];
    const currentIndex = seasonEpisodes.findIndex(ep => ep.id === selectedEpisode.id);
    return currentIndex > 0 ? seasonEpisodes[currentIndex - 1] : null;
  };

  const handleNextEpisode = () => {
    const nextEp = getNextEpisode();
    if (nextEp) {
      setSelectedEpisode(nextEp);
    }
  };

  const handlePreviousEpisode = () => {
    const prevEp = getPreviousEpisode();
    if (prevEp) {
      setSelectedEpisode(prevEp);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold anime-gradient-text">
              {anime.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Anime Info */}
            <div className="lg:col-span-1">
              <div className="aspect-[3/4] rounded-lg overflow-hidden mb-4">
                <img
                  src={anime.cover_image || '/placeholder.svg'}
                  alt={anime.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-3">
                {anime.rating && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-2" />
                    <span className="font-semibold">{anime.rating}/10</span>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {anime.genres?.map((genre) => (
                    <Badge key={genre} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>
                
                <div className="space-y-2 text-sm">
                  {anime.studio && (
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{anime.studio}</span>
                    </div>
                  )}
                  
                  {anime.release_year && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{anime.release_year}</span>
                    </div>
                  )}
                  
                  {anime.episode_count && (
                    <div className="flex items-center">
                      <Play className="h-4 w-4 mr-2" />
                      <span>{anime.episode_count} episodes</span>
                    </div>
                  )}
                </div>
                
                <Badge
                  variant={anime.status === 'completed' ? 'default' : 'secondary'}
                  className="capitalize"
                >
                  {anime.status}
                </Badge>
              </div>
            </div>
            
            {/* Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="synopsis" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="synopsis">Synopsis</TabsTrigger>
                  <TabsTrigger value="episodes">Episodes</TabsTrigger>
                </TabsList>
                
                <TabsContent value="synopsis" className="mt-4">
                  <div className="space-y-4">
                    {anime.title_english && anime.title_english !== anime.title && (
                      <div>
                        <h4 className="font-semibold mb-1">English Title</h4>
                        <p className="text-muted-foreground">{anime.title_english}</p>
                      </div>
                    )}
                    
                    {anime.title_japanese && (
                      <div>
                        <h4 className="font-semibold mb-1">Japanese Title</h4>
                        <p className="text-muted-foreground">{anime.title_japanese}</p>
                      </div>
                    )}
                    
                    {anime.synopsis && (
                      <div>
                        <h4 className="font-semibold mb-2">Synopsis</h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {anime.synopsis}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="episodes" className="mt-4">
                  {loading ? (
                    <div className="text-center py-8">Loading episodes...</div>
                  ) : seasons.length > 0 ? (
                    <div className="space-y-6">
                      {seasons.map((season) => (
                        <div key={season.id}>
                          <h3 className="text-lg font-semibold mb-3">
                            Season {season.season_number}: {season.title}
                          </h3>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {(episodes[season.id] || []).map((episode) => (
                              <Card 
                                key={episode.id}
                                className="cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => handleEpisodeClick(episode)}
                              >
                                <CardHeader className="pb-2">
                                  <div className="flex justify-between items-start">
                                    <CardTitle className="text-sm">
                                      Episode {episode.episode_number}
                                    </CardTitle>
                                    {episode.google_drive_link && (
                                      <Badge className="bg-green-500/20 text-green-700 dark:text-green-300">
                                        <Play className="h-3 w-3 mr-1" />
                                        Watch
                                      </Badge>
                                    )}
                                  </div>
                                  <CardDescription className="line-clamp-1">
                                    {episode.title}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    {episode.duration && (
                                      <div className="flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {episode.duration}min
                                      </div>
                                    )}
                                    {episode.air_date && (
                                      <div className="flex items-center">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {new Date(episode.air_date).toLocaleDateString()}
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No episodes available yet.
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Player */}
      {selectedEpisode && (
        <VideoPlayer
          isOpen={showPlayer}
          onClose={() => setShowPlayer(false)}
          googleDriveLink={selectedEpisode.google_drive_link}
          episodeTitle={selectedEpisode.title}
          episodeNumber={selectedEpisode.episode_number}
          onNextEpisode={getNextEpisode() ? handleNextEpisode : undefined}
          onPreviousEpisode={getPreviousEpisode() ? handlePreviousEpisode : undefined}
          hasNext={!!getNextEpisode()}
          hasPrevious={!!getPreviousEpisode()}
        />
      )}
    </>
  );
};

export default AnimeDetailsDialog;
