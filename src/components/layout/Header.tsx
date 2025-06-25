
import React, { useState } from 'react';
import { Search, Menu, User, Bell, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from 'next-themes';
import Link from 'next/link';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">@</span>
            </div>
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 animate-pulse"></div>
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AnimeNexus
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/anime" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
            Anime
          </Link>
          <Link href="/manga" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
            Manga
          </Link>
          <Link href="/news" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
            News
          </Link>
          <Link href="/community" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
            Community
          </Link>
        </nav>

        {/* Search */}
        <div className="hidden sm:flex flex-1 max-w-sm mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search anime, manga..."
              className="pl-10 bg-muted/50 border-muted focus:bg-background"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Bell className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <User className="h-4 w-4" />
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <nav className="container px-4 py-4 space-y-2">
            <Link href="/anime" className="block py-2 text-foreground/80 hover:text-foreground">
              Anime
            </Link>
            <Link href="/manga" className="block py-2 text-foreground/80 hover:text-foreground">
              Manga
            </Link>
            <Link href="/news" className="block py-2 text-foreground/80 hover:text-foreground">
              News
            </Link>
            <Link href="/community" className="block py-2 text-foreground/80 hover:text-foreground">
              Community
            </Link>
            <div className="pt-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search..." className="pl-10" />
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
