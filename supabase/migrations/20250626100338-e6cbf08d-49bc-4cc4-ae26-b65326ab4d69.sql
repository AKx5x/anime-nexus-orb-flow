
-- Add seasons table to organize episodes by seasons
CREATE TABLE public.seasons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  anime_id UUID REFERENCES public.anime(id) ON DELETE CASCADE,
  season_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  release_year INTEGER,
  episode_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(anime_id, season_number)
);

-- Update episodes table to reference seasons
ALTER TABLE public.episodes 
ADD COLUMN season_id UUID REFERENCES public.seasons(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX idx_seasons_anime_id ON public.seasons(anime_id);
CREATE INDEX idx_episodes_season_id ON public.episodes(season_id);
CREATE INDEX idx_episodes_anime_id ON public.episodes(anime_id);

-- Add trigger to update episode count in seasons
CREATE OR REPLACE FUNCTION update_season_episode_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.seasons 
    SET episode_count = episode_count + 1,
        updated_at = now()
    WHERE id = NEW.season_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.seasons 
    SET episode_count = episode_count - 1,
        updated_at = now()
    WHERE id = OLD.season_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_season_episode_count
  AFTER INSERT OR DELETE ON public.episodes
  FOR EACH ROW EXECUTE FUNCTION update_season_episode_count();

-- Add RLS policies for seasons
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view seasons" ON public.seasons
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage seasons" ON public.seasons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'moderator')
    )
  );
