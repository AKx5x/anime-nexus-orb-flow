
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
import { Play, TrendingUp, Star, Clock, ArrowRight, Zap, BookOpen, Users, Award, Eye } from 'lucide-react';
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
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Red Banner Section */}
        <section className="red-banner py-4">
          <div className="content-container">
            <div className="flex items-center justify-center space-x-4">
              <Award className="w-6 h-6" />
              <h2 className="text-xl font-bold">Latest Updates - New Episodes & Manga Chapters Available!</h2>
              <Award className="w-6 h-6" />
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="py-16 bg-white">
          <div className="content-container text-center">
            <h1 className="title-main">
              AnimeNexus
            </h1>
            <p className="subtitle max-w-3xl mx-auto">
              Discover thousands of anime series and manga chapters with high-quality streaming 
              and crystal-clear reading experience. Join our community of anime enthusiasts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/anime">
                <Button size="lg" className="btn-red text-lg px-8 py-4">
                  <Play className="mr-2 h-5 w-5" />
                  Start Watching
                </Button>
              </Link>
              <Link to="/manga">
                <Button size="lg" className="btn-transparent text-lg px-8 py-4">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Read Manga
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <StatsSection 
          animeCount={featuredAnime?.length || 1000}
          mangaCount={500}
          episodeCount={50000}
        />

        {/* Continue Watching & Quick Actions */}
        <section className="py-12 bg-gray-50">
          <div className="content-container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <RecentlyWatched />
              </div>
              <div className="clean-card">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-red-500" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link to="/anime" className="block">
                    <Button variant="ghost" className="w-full justify-start hover:bg-red-50 hover:text-red-600">
                      <Play className="w-4 h-4 mr-3" />
                      Browse All Anime
                    </Button>
                  </Link>
                  <Link to="/manga" className="block">
                    <Button variant="ghost" className="w-full justify-start hover:bg-red-50 hover:text-red-600">
                      <BookOpen className="w-4 h-4 mr-3" />
                      Read Latest Manga
                    </Button>
                  </Link>
                  <Link to="/news" className="block">
                    <Button variant="ghost" className="w-full justify-start hover:bg-red-50 hover:text-red-600">
                      <Zap className="w-4 h-4 mr-3" />
                      Latest News
                    </Button>
                  </Link>
                  <Link to="/auth" className="block">
                    <Button variant="ghost" className="w-full justify-start hover:bg-red-50 hover:text-red-600">
                      <Users className="w-4 h-4 mr-3" />
                      Join Community
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Currently Airing / Trending Now */}
        <section className="py-16 bg-white">
          <div className="content-container">
            <div className="section-header">
              <div className="flex items-center space-x-4">
                <TrendingUp className="w-8 h-8 text-red-500" />
                <h2 className="title-section">Currently Airing / Trending Now</h2>
                <Badge className="trending-badge text-white font-bold px-4 py-2">
                  HOT
                </Badge>
              </div>
              <Link to="/anime">
                <Button variant="ghost" className="text-red-500 hover:text-red-600 nav-link">
                  View All 
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="anime-grid">
              {trendingAnime?.map((anime, index) => (
                <div key={anime.id} className="relative hover-lift">
                  <div className="absolute -top-2 -left-2 z-10">
                    <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
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
        <section className="py-16 bg-gray-50">
          <div className="content-container">
            <div className="section-header">
              <div className="flex items-center space-x-4">
                <BookOpen className="w-8 h-8 text-red-500" />
                <h2 className="title-section">Popular Manga</h2>
              </div>
              <Link to="/manga">
                <Button variant="ghost" className="text-red-500 hover:text-red-600 nav-link">
                  Read More 
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="manga-grid">
              {popularManga?.map((manga) => (
                <div key={manga.id} className="hover-lift">
                  <MangaCard manga={manga} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest News */}
        <section className="py-16 bg-white">
          <div className="content-container">
            <div className="section-header">
              <div className="flex items-center space-x-4">
                <Zap className="w-8 h-8 text-red-500" />
                <h2 className="title-section">Latest News & Updates</h2>
              </div>
              <Link to="/news">
                <Button variant="ghost" className="text-red-500 hover:text-red-600 nav-link">
                  All News 
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentNews?.map((article) => (
                <Link key={article.id} to={`/news/${article.slug}`}>
                  <Card className="news-card h-full">
                    {article.featured_image && (
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={article.featured_image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <Badge className="absolute top-3 left-3 bg-red-500 text-white font-bold">
                          {article.category}
                        </Badge>
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg text-black mb-2 line-clamp-2 hover:text-red-500 transition-colors">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                          {article.excerpt}
                        </p>
                      )}
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
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
        <section className="py-20 red-banner">
          <div className="content-container text-center text-white">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl mb-10 max-w-3xl mx-auto opacity-90">
              Join thousands of anime enthusiasts worldwide. Stream unlimited anime, read the latest manga, 
              and connect with a passionate community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-white text-red-500 hover:bg-gray-100 px-10 py-4 text-xl font-bold">
                  <Play className="w-5 h-5 mr-2" />
                  Start Free Today
                </Button>
              </Link>
              <Link to="/anime">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-500 px-10 py-4 text-xl">
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
