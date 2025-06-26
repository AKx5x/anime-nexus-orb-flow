
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Calendar, User, Clock, Share2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Tables } from '@/integrations/supabase/types';

const NewsDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    if (!slug) return;

    const { data, error } = await supabase
      .from('news')
      .select(`
        *,
        profiles (
          display_name,
          username,
          avatar_url
        )
      `)
      .eq('slug', slug)
      .single();

    if (data && !error) {
      setArticle(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-white text-xl">Loading article...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-white text-xl">Article not found</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/news')}
          className="text-white hover:bg-white/10 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to News
        </Button>

        <article className="max-w-4xl mx-auto">
          {/* Featured Image */}
          {article.featured_image && (
            <div className="relative aspect-video mb-8 rounded-xl overflow-hidden">
              <img
                src={article.featured_image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          )}

          {/* Article Header */}
          <Card className="glass-card mb-8 p-8">
            <div className="mb-6">
              <Badge className="anime-gradient-bg text-white mb-4 capitalize">
                {article.category}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {article.title}
              </h1>
              {article.excerpt && (
                <p className="text-xl text-gray-300 leading-relaxed">
                  {article.excerpt}
                </p>
              )}
            </div>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 border-t border-white/10 pt-6">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>
                  {article.profiles?.display_name || article.profiles?.username || 'Anonymous'}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {new Date(article.published_at || article.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>
                  {Math.max(1, Math.ceil(article.content.length / 1000))} min read
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-white/10 ml-auto"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: article.title,
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </Card>

          {/* Article Content */}
          <Card className="glass-card p-8">
            <div 
              className="prose prose-invert prose-lg max-w-none"
              style={{
                color: '#e2e8f0',
                lineHeight: '1.8'
              }}
            >
              <div
                dangerouslySetInnerHTML={{ 
                  __html: article.content
                    .replace(/\n\n/g, '</p><p class="mb-6">')
                    .replace(/\n/g, '<br/>')
                    .replace(/^/, '<p class="mb-6">')
                    .replace(/$/, '</p>')
                }}
              />
            </div>
          </Card>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default NewsDetail;
