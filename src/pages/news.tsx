
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Calendar, User } from 'lucide-react';
import { useNews } from '@/hooks/useNews';

const NewsPage = () => {
  const { data: news, isLoading, error } = useNews();

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-500">Error loading news: {error.message}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Anime & Manga News
          </h1>
          <p className="text-muted-foreground text-lg">
            Stay updated with the latest industry news and announcements
          </p>
        </div>

        {/* News Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg aspect-video mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : news && news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article) => (
              <Card key={article.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className="relative">
                  <AspectRatio ratio={16/9}>
                    <img
                      src={article.featured_image || '/placeholder.svg'}
                      alt={article.title}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                  </AspectRatio>
                  <div className="absolute top-2 left-2">
                    <Badge className="capitalize bg-gradient-to-r from-purple-500 to-pink-500">
                      {article.category}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {article.excerpt}
                    </p>
                  )}
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{article.profiles?.display_name || article.profiles?.username || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(article.published_at || '').toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No news articles available.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default NewsPage;
