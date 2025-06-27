
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Play, BookOpen, Users, Trophy, Zap, Heart } from 'lucide-react';

interface StatsSectionProps {
  animeCount?: number;
  mangaCount?: number;
  episodeCount?: number;
}

const StatsSection = ({ animeCount = 1000, mangaCount = 500, episodeCount = 50000 }: StatsSectionProps) => {
  const stats = [
    {
      icon: Play,
      value: `${animeCount}+`,
      label: 'Anime Series',
      description: 'Latest releases',
      color: 'text-blue-400'
    },
    {
      icon: BookOpen,
      value: `${mangaCount}+`,
      label: 'Manga Titles',
      description: 'Updated daily',
      color: 'text-green-400'
    },
    {
      icon: Zap,
      value: `${episodeCount}+`,
      label: 'Episodes',
      description: 'HD Quality',
      color: 'text-yellow-400'
    },
    {
      icon: Users,
      value: '100K+',
      label: 'Active Users',
      description: 'Join the community',
      color: 'text-purple-400'
    },
    {
      icon: Trophy,
      value: '4.9★',
      label: 'User Rating',
      description: 'Highly rated',
      color: 'text-orange-400'
    },
    {
      icon: Heart,
      value: '24/7',
      label: 'Streaming',
      description: 'Always available',
      color: 'text-red-400'
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-brown-dark/20 to-brown-secondary/10" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 brown-anime-text">
            Platform Statistics
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join millions of anime fans worldwide on the most comprehensive streaming platform
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className={`stats-card slide-in-up stagger-${index + 1}`}>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className={`inline-flex p-4 rounded-full bg-primary/10 mb-4 ${stat.color}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="stats-number mb-2">
                      {stat.value}
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-1">
                      {stat.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
