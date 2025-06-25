
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AnimeCard from '@/components/ui/anime-card';
import MangaCard from '@/components/ui/manga-card';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { useAnime } from '@/hooks/useAnime';
import { useManga } from '@/hooks/useManga';
import { useNews } from '@/hooks/useNews';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const Index = () => {
  const { data: anime } = useAnime();
  const { data: manga } = useManga();
  const { data: news } = useNews();

  const handleWatch = (id: string) => {
    toast.success('Redirecting to watch anime...');
  };

  const handleRead = (id: string) => {
    toast.success('Opening manga reader...');
  };

  const handleFavorite = (id: string) => {
    toast.success('Added to favorites!');
  };

  const featuredAnime = anime?.slice(0, 6) || [];
  const featuredManga = manga?.slice(0, 6) || [];
  const latestNews = news?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <HeroSection />

      <main className="container mx-auto px-4">
        {/* Featured Anime Section */}
        <section className="py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Trending Anime
              </h2>
              <p className="text-muted-foreground">Most popular anime series right now</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/anime">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {featuredAnime.map((item) => (
              <AnimeCard
                key={item.id}
                anime={item}
                onWatch={handleWatch}
                onFavorite={handleFavorite}
              />
            ))}
          </div>
        </section>

        {/* Featured Manga Section */}
        <section className="py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Popular Manga
              </h2>
              <p className="text-muted-foreground">Top rated manga series</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/manga">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {featuredManga.map((item) => (
              <MangaCard
                key={item.id}
                manga={item}
                onRead={handleRead}
                onFavorite={handleFavorite}
              />
            ))}
          </div>
        </section>

        {/* Latest News Section */}
        <section className="py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Latest News
              </h2>
              <p className="text-muted-foreground">Stay updated with anime and manga news</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/news">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestNews.map((article) => (
              <Card key={article.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="relative">
                  <img
                    src={article.featured_image || '/placeholder.svg'}
                    alt={article.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 capitalize">
                    {article.category}
                  </Badge>
                </div>
                
                <CardHeader>
                  <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {article.title}
                  </h3>
                </CardHeader>

                <CardContent>
                  {article.excerpt && (
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{article.profiles?.display_name || 'Admin'}</span>
                    <span>{new Date(article.published_at || '').toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-muted/30 rounded-2xl mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Join Our Community
            </h2>
            <p className="text-muted-foreground text-lg">
              Connect with millions of anime and manga fans worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">10K+</div>
              <div className="text-muted-foreground">Anime Series</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-600 mb-2">50K+</div>
              <div className="text-muted-foreground">Manga Chapters</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">1M+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-muted-foreground">Community Support</div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
