
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';
import { useNews } from '@/hooks/useNews';

const NewsPage = () => {
  const { data: news, isLoading, error } = useNews();
  const navigate = useNavigate();

  const handleReadMore = (slug: string) => {
    navigate(`/news/${slug}`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-400 text-lg">Error loading news: {error.message}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Professional Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold anime-gradient-text mb-4">
            Anime & Manga News
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest industry news, announcements, and exclusive content
          </p>
        </div>

        {/* News Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="news-card animate-pulse">
                <div className="aspect-video bg-white/10 rounded-lg mb-4"></div>
                <CardHeader>
                  <div className="h-6 bg-white/10 rounded mb-2"></div>
                  <div className="h-4 bg-white/10 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : news && news.length > 0 ? (
          <>
            {/* Featured Article */}
            {news[0] && (
              <Card className="news-card mb-12 overflow-hidden cursor-pointer" onClick={() => handleReadMore(news[0].slug)}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="relative">
                    <AspectRatio ratio={16/9} className="lg:aspect-square">
                      <img
                        src={news[0].featured_image || '/placeholder.svg'}
                        alt={news[0].title}
                        className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                      />
                    </AspectRatio>
                    <div className="absolute top-4 left-4">
                      <Badge className="anime-gradient-bg text-white border-0 shadow-lg">
                        Featured
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col justify-center">
                    <Badge className="w-fit mb-4 capitalize bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 border-purple-400/30">
                      {news[0].category}
                    </Badge>
                    
                    <h2 className="text-3xl font-bold text-white mb-4 hover:text-purple-300 transition-colors">
                      {news[0].title}
                    </h2>
                    
                    {news[0].excerpt && (
                      <p className="text-gray-300 text-lg mb-6 line-clamp-3 leading-relaxed">
                        {news[0].excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          <span>{news[0].profiles?.display_name || news[0].profiles?.username || 'Anonymous'}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{new Date(news[0].published_at || '').toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="anime-button w-fit"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReadMore(news[0].slug);
                      }}
                    >
                      Read Full Article
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Regular Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.slice(1).map((article) => (
                <Card 
                  key={article.id} 
                  className="news-card cursor-pointer group"
                  onClick={() => handleReadMore(article.slug)}
                >
                  <div className="relative overflow-hidden">
                    <AspectRatio ratio={16/9}>
                      <img
                        src={article.featured_image || '/placeholder.svg'}
                        alt={article.title}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      />
                    </AspectRatio>
                    <div className="absolute top-3 left-3">
                      <Badge className="capitalize bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white border-0 backdrop-blur-sm">
                        {article.category}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <CardHeader className="pb-4">
                    <h3 className="font-bold text-xl line-clamp-2 group-hover:text-purple-300 transition-colors text-white mb-2">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
                        {article.excerpt}
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          <span>{article.profiles?.display_name || article.profiles?.username || 'Anonymous'}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{new Date(article.published_at || '').toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-purple-400 hover:text-white hover:bg-purple-600/20 p-0 h-auto font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReadMore(article.slug);
                      }}
                    >
                      Read More
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-2xl font-bold text-white mb-2">No News Yet</h3>
            <p className="text-gray-400 text-lg">Check back soon for the latest anime and manga news!</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default NewsPage;
