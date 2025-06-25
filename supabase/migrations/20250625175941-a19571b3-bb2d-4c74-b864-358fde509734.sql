
-- Create enum for content types and user roles
CREATE TYPE content_status AS ENUM ('ongoing', 'completed', 'upcoming', 'cancelled');
CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin');
CREATE TYPE news_category AS ENUM ('industry', 'reviews', 'trailers', 'events');

-- User profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'user',
  dark_mode BOOLEAN DEFAULT false,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Anime table
CREATE TABLE public.anime (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_japanese TEXT,
  title_english TEXT,
  synopsis TEXT,
  cover_image TEXT,
  banner_image TEXT,
  studio TEXT,
  release_year INTEGER,
  episode_count INTEGER,
  rating DECIMAL(3,2) DEFAULT 0,
  genres TEXT[],
  status content_status DEFAULT 'ongoing',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Manga table
CREATE TABLE public.manga (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_japanese TEXT,
  title_english TEXT,
  synopsis TEXT,
  cover_image TEXT,
  banner_image TEXT,
  author TEXT,
  artist TEXT,
  chapter_count INTEGER,
  rating DECIMAL(3,2) DEFAULT 0,
  genres TEXT[],
  status content_status DEFAULT 'ongoing',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- News table
CREATE TABLE public.news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  category news_category DEFAULT 'industry',
  author_id UUID REFERENCES public.profiles(id),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User favorites table
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('anime', 'manga')),
  content_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, content_type, content_id)
);

-- User watch/read history
CREATE TABLE public.user_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('anime', 'manga')),
  content_id UUID NOT NULL,
  last_episode INTEGER,
  last_chapter INTEGER,
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anime ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manga ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- RLS Policies for anime (public read, admin write)
CREATE POLICY "Anyone can view anime" ON public.anime FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage anime" ON public.anime FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

-- RLS Policies for manga (public read, admin write)
CREATE POLICY "Anyone can view manga" ON public.manga FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage manga" ON public.manga FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

-- RLS Policies for news (public read, admin write)
CREATE POLICY "Anyone can view published news" ON public.news FOR SELECT TO anon, authenticated USING (published_at <= now());
CREATE POLICY "Admins can manage news" ON public.news FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

-- RLS Policies for favorites
CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own favorites" ON public.favorites FOR ALL TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for user history
CREATE POLICY "Users can view own history" ON public.user_history FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own history" ON public.user_history FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$;

-- Trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data for anime
INSERT INTO public.anime (title, title_japanese, title_english, synopsis, cover_image, studio, release_year, episode_count, rating, genres, status) VALUES
('鬼滅の刃', '鬼滅の刃', 'Demon Slayer', 'A young boy becomes a demon slayer to avenge his family and cure his sister.', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', 'Ufotable', 2019, 26, 9.5, ARRAY['Action', 'Supernatural', 'Historical'], 'completed'),
('進撃の巨人', '進撃の巨人', 'Attack on Titan', 'Humanity fights for survival against giant humanoid Titans.', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', 'Studio Pierrot', 2013, 87, 9.0, ARRAY['Action', 'Drama', 'Fantasy'], 'completed'),
('君の名は', '君の名は', 'Your Name', 'Two teenagers share a profound, magical connection upon discovering they are swapping bodies.', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', 'CoMix Wave Films', 2016, 1, 8.4, ARRAY['Romance', 'Drama', 'Supernatural'], 'completed');

-- Insert sample data for manga
INSERT INTO public.manga (title, title_japanese, title_english, synopsis, cover_image, author, artist, chapter_count, rating, genres, status) VALUES
('ワンピース', 'ワンピース', 'One Piece', 'Follow Monkey D. Luffy on his quest to become the Pirate King.', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', 'Eiichiro Oda', 'Eiichiro Oda', 1000, 9.2, ARRAY['Action', 'Adventure', 'Comedy'], 'ongoing'),
('NARUTO', 'NARUTO -ナルト-', 'Naruto', 'A young ninja seeks recognition and dreams of becoming the Hokage.', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', 'Masashi Kishimoto', 'Masashi Kishimoto', 700, 8.7, ARRAY['Action', 'Martial Arts', 'Comedy'], 'completed');

-- Insert sample news data
INSERT INTO public.news (title, slug, content, excerpt, featured_image, category, published_at) VALUES
('New Anime Season Announcements', 'new-anime-season-announcements', 'Exciting new anime series have been announced for the upcoming season...', 'Multiple studios announce their latest projects', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600', 'industry', now()),
('Manga Sales Hit Record High', 'manga-sales-record-high', 'Digital manga sales have reached unprecedented levels this year...', 'Digital platforms driving manga growth', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600', 'industry', now());
