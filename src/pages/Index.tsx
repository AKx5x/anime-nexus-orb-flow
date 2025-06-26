
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AnimeCard from '@/components/ui/anime-card';
import MangaCard from '@/components/ui/manga-card';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, TrendingUp, Star, Clock, ArrowRight, Fire, Calendar, Users } from 'lucide-react';
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

  const { data: featuredManga } = useQuery({
    queryKey: ['featured-manga'],
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
    <div className="min-h-screen bg-zinc-900">
      <Header />
      
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Quick Stats */}
        <section className="py-8 bg-zinc-800/50">
          <div className="animeil-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 animeil-card">
                <div className="text-2xl md:text-3xl font-bold text-red-500 mb-1">12K+</div>
                <div className="text-zinc-400 text-sm">Anime Episodes</div>
              </div>
              <div className="text-center p-4 animeil-card">
                <div className="text-2xl md:text-3xl font-bold text-red-500 mb-1">1.5K+</div>
                <div className="text-zinc-400 text-sm">Anime Series</div>
              </div>
              <div className="text-center p-4 animeil-card">
                <div className="text-2xl md:text-3xl font-bold text-red-500 mb-1">800+</div>
                <div className="text-zinc-400 text-sm">Manga Titles</div>
              </div>
              <div className="text-center p-4 animeil-card">
                <div className="text-2xl md:text-3xl font-bold text-red-500 mb-1">24/7</div>
                <div className="text-zinc-400 text-sm">HD Streaming</div>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Anime */}
        <section className="animeil-section bg-zinc-900">
          <div className="animeil-container">
            <div className="animeil-category-header">
              <div className="animeil-category-title">
                <Fire className="w-7 h-7 text-red-500" />
                <span>Trending Anime</span>
                <Badge className="animeil-badge animate-pulse">HOT</Badge>
              </div>
              <Link to="/anime">
                <Button variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-500/10">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            <div className="animeil-grid">
              {trendingAnime?.map((anime, index) => (
                <div key={anime.id} className="relative">
                  {index < 3 && (
                    <div className="absolute -top-2 -left-2 z-10">
                      <div className="w-7 h-7 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">
                        #{index + 1}
                      </div>
                    </div>
                  )}
                  <AnimeCard anime={anime} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Rated */}
        <section className="animeil-section bg-zinc-800/30">
          <div className="animeil-container">
            <div className="animeil-category-header">
              <div className="animeil-category-title">
                <Star className="w-7 h-7 text-yellow-500" />
                <span>Top Rated Anime</span>
              </div>
              <Link to="/anime">
                <Button variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-500/10">
                  Explore <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            <div className="animeil-grid">
              {featuredAnime?.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          </div>
        </section>

        {/* Popular Manga */}
        <section className="animeil-section bg-zinc-900">
          <div className="animeil-container">
            <div className="animeil-category-header">
              <div className="animeil-category-title">
                <span>📚</span>
                <span>Popular Manga</span>
              </div>
              <Link to="/manga">
                <Button variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-500/10">
                  Read More <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            <div className="animeil-grid">
              {featuredManga?.map((manga) => (
                <MangaCard key={manga.id} manga={manga} />
              ))}
            </div>
          </div>
        </section>

        {/* Latest News */}
        <section className="animeil-section bg-zinc-800/20">
          <div className="animeil-container">
            <div className="animeil-category-header">
              <div className="animeil-category-title">
                <span>📰</span>
                <span>Latest News</span>
              </div>
              <Link to="/news">
                <Button variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-500/10">
                  All News <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentNews?.map((article) => (
                <Link key={article.id} to={`/news/${article.slug}`}>
                  <Card className="animeil-news-card h-full cursor-pointer group">
                    {article.featured_image && (
                      <div className="aspect-[16/10] relative overflow-hidden">
                        <img
                          src={article.featured_image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <Badge className="absolute top-3 left-3 animeil-badge text-xs">
                          {article.category}
                        </Badge>
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
                          {article.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>
                            {new Date(article.published_at || article.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="text-red-500">Read →</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-red-600/20 via-red-500/10 to-red-600/20">
          <div className="animeil-container text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Join the Ultimate Anime Experience
            </h2>
            <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
              Stream thousands of anime episodes in HD, read manga chapters, and stay updated with the latest anime news.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button className="animeil-button px-8 py-3 text-base font-semibold">
                  <Play className="w-5 h-5 mr-2" />
                  Start Watching Now
                </Button>
              </Link>
              <Link to="/anime">
                <Button variant="outline" className="animeil-button-secondary px-8 py-3 text-base">
                  <Users className="w-5 h-5 mr-2" />
                  Browse Library
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
