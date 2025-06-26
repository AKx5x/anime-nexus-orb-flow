
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Play, SkipBack, SkipForward, Star, Calendar, Clock } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

const AnimeWatch = () => {
  const { animeId } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState<Tables<'anime'> | null>(null);
  const [seasons, setSeasons] = useState<any[]>([]);
  const [episodes, setEpisodes] = useState<{ [key: string]: any[] }>({});
  const [selectedEpisode, setSelectedEpisode] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (animeId) {
      fetchAnimeData();
    }
  }, [animeId]);

  const fetchAnimeData = async () => {
    if (!animeId) return;

    // Fetch anime details
    const { data: animeData } = await supabase
      .from('anime')
      .select('*')
      .eq('id', animeId)
      .single();

    if (animeData) {
      setAnime(animeData);

      // Fetch seasons
      const { data: seasonsData } = await supabase
        .from('seasons')
        .select('*')
        .eq('anime_id', animeId)
        .order('season_number');

      if (seasonsData) {
        setSeasons(seasonsData);

        // Fetch episodes for each season
        const episodePromises = seasonsData.map(async (season) => {
          const { data: episodesData } = await supabase
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

        // Auto-select first episode if available
        if (episodeResults.length > 0 && episodeResults[0].episodes.length > 0) {
          setSelectedEpisode(episodeResults[0].episodes[0]);
        }
      }
    }

    setLoading(false);
  };

  const getEmbedUrl = (driveLink: string) => {
    const fileIdMatch = driveLink.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
    return driveLink;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Anime not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="relative p-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/anime')}
          className="text-white hover:bg-white/10 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Anime
        </Button>

        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">{anime.title}</h1>
          {selectedEpisode && (
            <p className="text-purple-300 text-lg">
              Episode {selectedEpisode.episode_number}: {selectedEpisode.title}
            </p>
          )}
        </div>
      </div>

      {/* Video Player */}
      {selectedEpisode?.google_drive_link && (
        <div className="px-6 mb-8">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
            <iframe
              src={getEmbedUrl(selectedEpisode.google_drive_link)}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Player Controls */}
          <div className="flex justify-center items-center mt-4 space-x-4">
            <Button
              variant="outline"
              onClick={() => getPreviousEpisode() && setSelectedEpisode(getPreviousEpisode())}
              disabled={!getPreviousEpisode()}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <SkipBack className="h-4 w-4 mr-2" />
              Previous Episode
            </Button>

            <div className="text-white text-sm px-4 py-2 bg-white/10 rounded-lg">
              Episode {selectedEpisode.episode_number}
            </div>

            <Button
              variant="outline"
              onClick={() => getNextEpisode() && setSelectedEpisode(getNextEpisode())}
              disabled={!getNextEpisode()}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Next Episode
              <SkipForward className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Episode List */}
      <div className="px-6 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-11 gap-3 mb-8">
          {seasons.map((season) =>
            (episodes[season.id] || []).map((episode, index) => (
              <Card
                key={episode.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 p-3 text-center ${
                  selectedEpisode?.id === episode.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-2 border-yellow-400 shadow-lg shadow-yellow-400/50'
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                }`}
                onClick={() => setSelectedEpisode(episode)}
              >
                <div className="text-white font-semibold">
                  Episode {episode.episode_number}
                </div>
                {episode.duration && (
                  <div className="text-xs text-gray-300 mt-1">
                    {episode.duration}min
                  </div>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Episode Info */}
        {selectedEpisode && (
          <Card className="bg-white/10 border-white/20 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Episode {selectedEpisode.episode_number}: {selectedEpisode.title}
                </h3>
                {selectedEpisode.description && (
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {selectedEpisode.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                  {selectedEpisode.duration && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {selectedEpisode.duration} minutes
                    </div>
                  )}
                  {selectedEpisode.air_date && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(selectedEpisode.air_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Anime Info</h4>
                <div className="space-y-2">
                  {anime.rating && (
                    <div className="flex items-center text-yellow-400">
                      <Star className="h-4 w-4 mr-2 fill-yellow-400" />
                      <span>{anime.rating}/10</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {anime.genres?.slice(0, 3).map((genre) => (
                      <Badge key={genre} variant="secondary" className="bg-purple-600/30 text-purple-200">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                  {anime.studio && (
                    <p className="text-gray-300 text-sm">Studio: {anime.studio}</p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AnimeWatch;
