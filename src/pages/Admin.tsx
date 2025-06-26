
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimeManagement from '@/components/admin/AnimeManagement';
import MangaManagement from '@/components/admin/MangaManagement';
import NewsManagement from '@/components/admin/NewsManagement';
import UserManagement from '@/components/admin/UserManagement';
import SeasonManagement from '@/components/admin/SeasonManagement';
import EpisodeManagement from '@/components/admin/EpisodeManagement';
import ChapterManagement from '@/components/admin/ChapterManagement';
import { Activity, Users, BookOpen, Tv, Calendar, PlayCircle, FileText, TrendingUp } from 'lucide-react';

const Admin = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    animeCount: 0,
    mangaCount: 0,
    newsCount: 0,
    userCount: 0,
    seasonCount: 0,
    episodeCount: 0,
    chapterCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || (profile && !['admin', 'moderator'].includes(profile.role))) {
      navigate('/');
      return;
    }
    
    fetchStats();
  }, [user, profile, navigate]);

  const fetchStats = async () => {
    setLoading(true);
    const [animeRes, mangaRes, newsRes, userRes, seasonRes, episodeRes, chapterRes] = await Promise.all([
      supabase.from('anime').select('id', { count: 'exact', head: true }),
      supabase.from('manga').select('id', { count: 'exact', head: true }),
      supabase.from('news').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('seasons').select('id', { count: 'exact', head: true }),
      supabase.from('episodes').select('id', { count: 'exact', head: true }),
      supabase.from('chapters').select('id', { count: 'exact', head: true })
    ]);

    setStats({
      animeCount: animeRes.count || 0,
      mangaCount: mangaRes.count || 0,
      newsCount: newsRes.count || 0,
      userCount: userRes.count || 0,
      seasonCount: seasonRes.count || 0,
      episodeCount: episodeRes.count || 0,
      chapterCount: chapterRes.count || 0
    });
    setLoading(false);
  };

  if (!user || (profile && !['admin', 'moderator'].includes(profile.role))) {
    return null;
  }

  const statCards = [
    { 
      title: 'Total Anime', 
      value: stats.animeCount, 
      icon: Tv, 
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10'
    },
    { 
      title: 'Seasons', 
      value: stats.seasonCount, 
      icon: Calendar, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10'
    },
    { 
      title: 'Episodes', 
      value: stats.episodeCount, 
      icon: PlayCircle, 
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10'
    },
    { 
      title: 'Manga Series', 
      value: stats.mangaCount, 
      icon: BookOpen, 
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-500/10'
    },
    { 
      title: 'Chapters', 
      value: stats.chapterCount, 
      icon: FileText, 
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/10'
    },
    { 
      title: 'News Articles', 
      value: stats.newsCount, 
      icon: TrendingUp, 
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-500/10'
    },
    { 
      title: 'Total Users', 
      value: stats.userCount, 
      icon: Users, 
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Professional Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full mb-6">
            <Activity className="h-8 w-8 text-purple-400" />
          </div>
          <h1 className="text-5xl font-bold anime-gradient-text mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Manage your anime and manga platform with professional tools and comprehensive analytics
          </p>
        </div>

        {/* Professional Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6 mb-12">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className={`admin-card hover:scale-105 transition-all duration-300 ${stat.bgColor}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    {loading && <div className="animate-spin h-4 w-4 border-2 border-purple-400 border-t-transparent rounded-full" />}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-white mb-1">
                    {loading ? '...' : stat.value.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {stat.title}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Professional Management Tabs */}
        <Card className="admin-card">
          <CardHeader className="admin-header">
            <CardTitle className="text-2xl font-bold text-white">Content Management</CardTitle>
            <CardDescription className="text-gray-300">
              Manage all aspects of your anime and manga platform
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="anime" className="w-full">
              <TabsList className="grid w-full grid-cols-7 bg-white/5 p-1 m-6 mb-0">
                <TabsTrigger value="anime" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  <Tv className="h-4 w-4 mr-2" />
                  Anime
                </TabsTrigger>
                <TabsTrigger value="seasons" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <Calendar className="h-4 w-4 mr-2" />
                  Seasons
                </TabsTrigger>
                <TabsTrigger value="episodes" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Episodes
                </TabsTrigger>
                <TabsTrigger value="manga" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Manga
                </TabsTrigger>
                <TabsTrigger value="chapters" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                  <FileText className="h-4 w-4 mr-2" />
                  Chapters
                </TabsTrigger>
                <TabsTrigger value="news" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  News
                </TabsTrigger>
                <TabsTrigger value="users" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </TabsTrigger>
              </TabsList>
              
              <div className="p-6">
                <TabsContent value="anime" className="mt-0">
                  <AnimeManagement onUpdate={fetchStats} />
                </TabsContent>
                
                <TabsContent value="seasons" className="mt-0">
                  <SeasonManagement onUpdate={fetchStats} />
                </TabsContent>
                
                <TabsContent value="episodes" className="mt-0">
                  <EpisodeManagement onUpdate={fetchStats} />
                </TabsContent>
                
                <TabsContent value="manga" className="mt-0">
                  <MangaManagement onUpdate={fetchStats} />
                </TabsContent>
                
                <TabsContent value="chapters" className="mt-0">
                  <ChapterManagement onUpdate={fetchStats} />
                </TabsContent>
                
                <TabsContent value="news" className="mt-0">
                  <NewsManagement onUpdate={fetchStats} />
                </TabsContent>
                
                <TabsContent value="users" className="mt-0">
                  <UserManagement />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
