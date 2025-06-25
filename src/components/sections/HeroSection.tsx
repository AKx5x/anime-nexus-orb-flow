
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Plus } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-pink-900/90 to-blue-900/90">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200')] bg-cover bg-center opacity-30"></div>
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-4 h-4 bg-pink-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-6 h-6 bg-purple-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-16 w-5 h-5 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 right-20 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-pink-100 to-purple-100 bg-clip-text text-transparent animate-in slide-in-from-bottom-4 duration-1000">
          Welcome to AnimeNexus
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 animate-in slide-in-from-bottom-8 duration-1000 delay-200">
          Discover thousands of anime series, manga chapters, and connect with fellow otaku
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom-12 duration-1000 delay-400">
          <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg px-8 py-6">
            <Play className="mr-2 h-5 w-5" />
            Start Watching
          </Button>
          <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6">
            <Plus className="mr-2 h-5 w-5" />
            Browse Manga
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
