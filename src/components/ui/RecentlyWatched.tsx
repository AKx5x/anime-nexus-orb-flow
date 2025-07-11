
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, MoreHorizontal } from 'lucide-react';

interface RecentItem {
  id: string;
  title: string;
  episode?: number;
  chapter?: number;
  progress: number;
  thumbnail: string;
  type: 'anime' | 'manga';
  lastWatched: string;
}

interface RecentlyWatchedProps {
  items?: RecentItem[];
}

const RecentlyWatched = ({ items = [] }: RecentlyWatchedProps) => {
  // Mock data for demonstration
  const mockItems: RecentItem[] = [
    {
      id: '1',
      title: 'Attack on Titan',
      episode: 15,
      progress: 75,
      thumbnail: '/placeholder.svg',
      type: 'anime',
      lastWatched: '2 hours ago'
    },
    {
      id: '2',
      title: 'One Piece',
      chapter: 1095,
      progress: 60,
      thumbnail: '/placeholder.svg',
      type: 'manga',
      lastWatched: '1 day ago'
    },
    {
      id: '3',
      title: 'Demon Slayer',
      episode: 8,
      progress: 45,
      thumbnail: '/placeholder.svg',
      type: 'anime',
      lastWatched: '3 days ago'
    }
  ];

  const displayItems = items.length > 0 ? items : mockItems;

  if (displayItems.length === 0) {
    return null;
  }

  return (
    <Card className="clean-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-xl font-bold flex items-center text-black">
          <Clock className="w-5 h-5 mr-2 text-red-500" />
          Continue Watching
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer border border-transparent hover:border-gray-200">
              <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <div className="absolute bottom-1 left-1 right-1 h-1 bg-gray-300 rounded-full">
                  <div 
                    className="h-full bg-red-500 rounded-full transition-all"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-black truncate">
                  {item.title}
                </h4>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="genre-badge text-xs">
                    {item.type === 'anime' ? `Episode ${item.episode}` : `Chapter ${item.chapter}`}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {item.lastWatched}
                  </span>
                </div>
              </div>
              
              <Button size="sm" className="btn-red opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentlyWatched;
