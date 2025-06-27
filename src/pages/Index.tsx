
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FeaturedAnimeCarousel from '@/components/ui/FeaturedAnimeCarousel';
import AnimeCard from '@/components/ui/anime-card';
import MangaCard from '@/components/ui/manga-card';
import StatsSection from '@/components/ui/StatsSection';
import RecentlyWatched from '@/components/ui/RecentlyWatched';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, TrendingUp, Star, Clock, ArrowRight, Zap, Flame, BookOpen, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { data: featuredAnime } = useQuery({
    queryKey: ['featured-anime'],
    queryFn: async () => {
      const { data } = await supabase
        .from('anime')
        .select('*')
        .order('rating', { ascending: false })
        .limit(8);
      return data || [];
    }
  });

  const { data: trendingAnime } = useQuery({
    queryKey: ['trending-anime'],
    queryFn: async () => {
      const { data } = await supabase
        .from('anime')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(12);
      return data || [];
    }
  });

  const { data: popularManga } = useQuery({
    queryKey: ['popular-manga'],
    queryFn: async () => {
      const { data } = await supabase
        .from('manga')
        .select('*')
        .order('rating', { ascending: false })
        .limit(8);
      return data || [];
    }
  });

  const { data: recentNews } = useQuery({
    queryKey: ['recent-news'],
    queryFn: async () => {
      const { data } = await supabase
        .from('news')
        .select(`
          *,
          profiles (
            display_name,
            username
          )
        `)
        .order('published_at', { ascending: false })
        .limit(4);
      return data || [];
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section with Featured Carousel */}
        <section className="relative">
          <div className="hero-background-brown">
            <div className="container mx-auto px-4 py-12">
              {featuredAnime && featuredAnime.length > 0 ? (
                <FeaturedAnimeCarousel anime={featuredAnime.slice(0, 5)} />
              ) : (
                <div className="text-center py-32">
                  <h1 className="brown-anime-title mb-8">
                    Welcome to AnimeNexus
                  </h1>
                  <p className="brown-anime-subtitle mb-12 max-w-3xl mx-auto">
                    Discover the ultimate anime streaming experience with thousands of series, 
                    manga chapters, and a thriving community of fellow otaku.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Link to="/anime">
                      <Button size="lg" className="brown-anime-button px-10 py-6 text-lg">
                        <Play className="mr-3 h-6 w-6" />
                        Start Watching
                      </Button>
                    </Link>
                    <Link to="/manga">
                      <Button size="lg" variant="outline" className="border-brown-light/30 text-brown-light hover:bg-brown-light/10 px-10 py-6 text-lg">
                        <BookOpen className="mr-3 h-6 w-6" />
                        Read Manga
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-20 left-[10%] w-6 h-6 bg-primary/30 rounded-full brown-anime-float"></div>
            <div className="absolute top-40 right-[15%] w-4 h-4 bg-brown-accent/40 rounded-full brown-anime-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-32 left-[20%] w-8 h-8 bg-copper/20 rounded-full brown-anime-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-20 right-[25%] w-5 h-5 bg-bronze/30 rounded-full brown-anime-float" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </section>

        {/* Stats Section */}
        <StatsSection 
          animeCount={featuredAnime?.length || 1000}
          mangaCount={500}
          episodeCount={50000}
        />

        {/* Recently Watched Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <RecentlyWatched />
              </div>
              <div className="brown-glass-card p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Flame className="w-5 h-5 mr-2 text-orange-500" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link to="/anime">
                    <Button variant="ghost" className="w-full justify-start hover:bg-primary/10">
                      <Play className="w-4 h-4 mr-3" />
                      Browse All Anime
                    </Button>
                  </Link>
                  <Link to="/manga">
                    <Button variant="ghost" className="w-full justify-start hover:bg-primary/10">
                      <BookOpen className="w-4 h-4 mr-3" />
                      Read Latest Manga
                    </Button>
                  </Link>
                  <Link to="/news">
                    <Button variant="ghost" className="w-full justify-start hover:bg-primary/10">
                      <Zap className="w-4 h-4 mr-3" />
                      Latest News
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button variant="ghost" className="w-full justify-start hover:bg-primary/10">
                      <Users className="w-4 h-4 mr-3" />
                      Join Community
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Now */}
        <section className="py-20 bg-gradient-to-r from-brown-dark/10 to-brown-secondary/5">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center space-x-4">
                <TrendingUp className="w-8 h-8 text-primary" />
                <h2 className="text-4xl font-black text-foreground">Trending Now</h2>
                <Badge className="trending-badge-brown text-white font-bold px-4 py-2">
                  <Flame className="w-4 h-4 mr-1" />
                  HOT
                </Badge>
              </div>
              <Link to="/anime">
                <Button variant="ghost" className="text-primary hover:text-foreground group">
                  View All 
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {trendingAnime?.map((anime, index) => (
                <div key={anime.id} className="relative group">
                  <div className="absolute -top-3 -left-3 z-10">
                    <div className="w-10 h-10 bg-gradient-to-br from-gold to-copper rounded-full flex items-center justify-center text-black font-black text-sm shadow-lg">
                      #{index + 1}
                    </div>
                  </div>
                  <AnimeCard anime={anime} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Manga */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center space-x-4">
                <BookOpen className="w-8 h-8 text-primary" />
                <h2 className="text-4xl font-black text-foreground">Popular Manga</h2>
              </div>
              <Link to="/manga">
                <Button variant="ghost" className="text-primary hover:text-foreground group">
                  Read More 
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-6">
              {popularManga?.map((manga) => (
                <MangaCard key={manga.id} manga={manga} />
              ))}
            </div>
          </div>
        </section>

        {/* Latest News */}
        <section className="py-20 bg-gradient-to-r from-brown-secondary/5 to-brown-dark/10">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center space-x-4">
                <Zap className="w-8 h-8 text-primary" />
                <h2 className="text-4xl font-black text-foreground">Latest News</h2>
              </div>
              <Link to="/news">
                <Button variant="ghost" className="text-primary hover:text-foreground group">
                  All News 
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {recentNews?.map((article) => (
                <Link key={article.id} to={`/news/${article.slug}`}>
                  <Card className="news-card-brown h-full">
                    {article.featured_image && (
                      <div className="aspect-video relative overflow-hidden rounded-t-xl">
                        <img
                          src={article.featured_image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <Badge className="absolute top-4 left-4 brown-anime-gradient text-white font-bold">
                          {article.category}
                        </Badge>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
                          {article.excerpt}
                        </p>
                      )}
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>
                          {new Date(article.published_at || article.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 bg-gradient-to-r from-primary/20 via-brown-accent/20 to-primary/20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl md:text-6xl font-black mb-8 brown-anime-text">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Join millions of anime enthusiasts worldwide. Stream unlimited anime, read the latest manga, 
              and connect with a passionate community that shares your love for Japanese culture.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/auth">
                <Button size="lg" className="brown-anime-button px-12 py-6 text-xl font-bold">
                  <Play className="w-6 h-6 mr-3" />
                  Start Free Today
                </Button>
              </Link>
              <Link to="/anime">
                <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 px-12 py-6 text-xl">
                  Browse Collection
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
