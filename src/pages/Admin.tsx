
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

  useEffect(() => {
    // Check if user is admin/moderator
    if (!user || (profile && !['admin', 'moderator'].includes(profile.role))) {
      navigate('/');
      return;
    }
    
    fetchStats();
  }, [user, profile, navigate]);

  const fetchStats = async () => {
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
  };

  if (!user || (profile && !['admin', 'moderator'].includes(profile.role))) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold anime-gradient-text">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your anime and manga platform</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <Card className="anime-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Anime</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.animeCount}</div>
            </CardContent>
          </Card>
          <Card className="anime-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Seasons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.seasonCount}</div>
            </CardContent>
          </Card>
          <Card className="anime-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Episodes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.episodeCount}</div>
            </CardContent>
          </Card>
          <Card className="anime-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Manga</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-600">{stats.mangaCount}</div>
            </CardContent>
          </Card>
          <Card className="anime-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Chapters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.chapterCount}</div>
            </CardContent>
          </Card>
          <Card className="anime-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">News</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-600">{stats.newsCount}</div>
            </CardContent>
          </Card>
          <Card className="anime-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.userCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="anime" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="anime">Anime</TabsTrigger>
            <TabsTrigger value="seasons">Seasons</TabsTrigger>
            <TabsTrigger value="episodes">Episodes</TabsTrigger>
            <TabsTrigger value="manga">Manga</TabsTrigger>
            <TabsTrigger value="chapters">Chapters</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="anime" className="mt-6">
            <AnimeManagement onUpdate={fetchStats} />
          </TabsContent>
          
          <TabsContent value="seasons" className="mt-6">
            <SeasonManagement onUpdate={fetchStats} />
          </TabsContent>
          
          <TabsContent value="episodes" className="mt-6">
            <EpisodeManagement onUpdate={fetchStats} />
          </TabsContent>
          
          <TabsContent value="manga" className="mt-6">
            <MangaManagement onUpdate={fetchStats} />
          </TabsContent>
          
          <TabsContent value="chapters" className="mt-6">
            <ChapterManagement onUpdate={fetchStats} />
          </TabsContent>
          
          <TabsContent value="news" className="mt-6">
            <NewsManagement onUpdate={fetchStats} />
          </TabsContent>
          
          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
