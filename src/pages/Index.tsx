
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AnimeCard from '@/components/ui/anime-card';
import MangaCard from '@/components/ui/manga-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, TrendingUp, Star, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { data: featuredAnime } = useQuery({
    queryKey: ['featured-anime'],
    queryFn: async () => {
      const { data } = await supabase
        .from('anime')
        .select('*')
        .order('rating', { ascending: false })
        .limit(6);
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
        .limit(8);
      return data || [];
    }
  });

  const { data: featuredManga } = useQuery({
    queryKey: ['featured-manga'],
    queryFn: async () => {
      const { data } = await supabase
        .from('manga')
        .select('*')
        .order('rating', { ascending: false })
        .limit(6);
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
        .limit(3);
      return data || [];
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950">
      <Header />
      
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold anime-gradient-text">1000+</div>
                <div className="text-gray-400 mt-2">Anime Series</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold anime-gradient-text">500+</div>
                <div className="text-gray-400 mt-2">Manga Titles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold anime-gradient-text">50K+</div>
                <div className="text-gray-400 mt-2">Episodes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold anime-gradient-text">24/7</div>
                <div className="text-gray-400 mt-2">Streaming</div>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Now */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center space-x-4">
                <TrendingUp className="w-8 h-8 text-purple-500" />
                <h2 className="text-3xl font-bold text-white">Trending Now</h2>
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse">
                  HOT
                </Badge>
              </div>
              <Link to="/anime">
                <Button variant="ghost" className="text-purple-400 hover:text-white">
                  View All <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
              {trendingAnime?.map((anime, index) => (
                <div key={anime.id} className="relative group">
                  <div className="absolute -top-2 -left-2 z-10">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                      #{index + 1}
                    </div>
                  </div>
                  <AnimeCard anime={anime} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Anime */}
        <section className="py-20 bg-gradient-to-r from-slate-900/50 to-purple-900/20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center space-x-4">
                <Star className="w-8 h-8 text-yellow-500" />
                <h2 className="text-3xl font-bold text-white">Featured Anime</h2>
              </div>
              <Link to="/anime">
                <Button variant="ghost" className="text-purple-400 hover:text-white">
                  Explore All <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {featuredAnime?.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Manga */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-white">Popular Manga</h2>
              <Link to="/manga">
                <Button variant="ghost" className="text-purple-400 hover:text-white">
                  Read More <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {featuredManga?.map((manga) => (
                <MangaCard key={manga.id} manga={manga} />
              ))}
            </div>
          </div>
        </section>

        {/* Latest News */}
        <section className="py-20 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-white">Latest News</h2>
              <Link to="/news">
                <Button variant="ghost" className="text-purple-400 hover:text-white">
                  All News <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentNews?.map((article) => (
                <Link key={article.id} to={`/news/${article.slug}`}>
                  <Card className="glass-card hover:scale-105 transition-all duration-300 cursor-pointer h-full">
                    {article.featured_image && (
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        <img
                          src={article.featured_image}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <Badge className="absolute top-4 left-4 bg-purple-600 text-white">
                          {article.category}
                        </Badge>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg text-white mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                      )}
                      <div className="flex items-center text-sm text-gray-400">
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
        <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Anime Journey?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Join thousands of anime fans and discover your next favorite series. 
              Stream unlimited anime and read manga - all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                  <Play className="w-5 h-5 mr-2" />
                  Start Watching Free
                </Button>
              </Link>
              <Link to="/anime">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
                  Browse Anime
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
