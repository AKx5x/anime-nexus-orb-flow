
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Star, Calendar, Users, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import MangaReader from '@/components/reader/MangaReader';

interface MangaDetailsDialogProps {
  manga: Tables<'manga'>;
  isOpen: boolean;
  onClose: () => void;
  onRead?: (mangaId: string, chapterNumber?: number) => void;
}

const MangaDetailsDialog: React.FC<MangaDetailsDialogProps> = ({
  manga,
  isOpen,
  onClose,
  onRead
}) => {
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [showReader, setShowReader] = useState(false);

  useEffect(() => {
    if (isOpen && manga.id) {
      fetchChapters();
    }
  }, [isOpen, manga.id]);

  const fetchChapters = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('manga_id', manga.id)
      .order('chapter_number');

    if (!error && data) {
      setChapters(data);
    }
    
    setLoading(false);
  };

  const handleChapterClick = (chapter: any) => {
    if (chapter.google_drive_link) {
      setSelectedChapter(chapter);
      setShowReader(true);
      onRead?.(manga.id, chapter.chapter_number);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold anime-gradient-text">
              {manga.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Manga Info */}
            <div className="lg:col-span-1">
              <div className="aspect-[3/4] rounded-lg overflow-hidden mb-4">
                <img
                  src={manga.cover_image || '/placeholder.svg'}
                  alt={manga.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-3">
                {manga.rating && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-2" />
                    <span className="font-semibold">{manga.rating}/10</span>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {manga.genres?.map((genre) => (
                    <Badge key={genre} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>
                
                <div className="space-y-2 text-sm">
                  {manga.author && (
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Author: {manga.author}</span>
                    </div>
                  )}
                  
                  {manga.artist && manga.artist !== manga.author && (
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Artist: {manga.artist}</span>
                    </div>
                  )}
                  
                  {manga.chapter_count && (
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      <span>{manga.chapter_count} chapters</span>
                    </div>
                  )}
                </div>
                
                <Badge
                  variant={manga.status === 'completed' ? 'default' : 'secondary'}
                  className="capitalize"
                >
                  {manga.status}
                </Badge>
              </div>
            </div>
            
            {/* Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="synopsis" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="synopsis">Synopsis</TabsTrigger>
                  <TabsTrigger value="chapters">Chapters</TabsTrigger>
                </TabsList>
                
                <TabsContent value="synopsis" className="mt-4">
                  <div className="space-y-4">
                    {manga.title_english && manga.title_english !== manga.title && (
                      <div>
                        <h4 className="font-semibold mb-1">English Title</h4>
                        <p className="text-muted-foreground">{manga.title_english}</p>
                      </div>
                    )}
                    
                    {manga.title_japanese && (
                      <div>
                        <h4 className="font-semibold mb-1">Japanese Title</h4>
                        <p className="text-muted-foreground">{manga.title_japanese}</p>
                      </div>
                    )}
                    
                    {manga.synopsis && (
                      <div>
                        <h4 className="font-semibold mb-2">Synopsis</h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {manga.synopsis}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="chapters" className="mt-4">
                  {loading ? (
                    <div className="text-center py-8">Loading chapters...</div>
                  ) : chapters.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                      {chapters.map((chapter) => (
                        <Card 
                          key={chapter.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => handleChapterClick(chapter)}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-sm">
                                Chapter {chapter.chapter_number}
                              </CardTitle>
                              {chapter.google_drive_link && (
                                <Badge className="bg-green-500/20 text-green-700 dark:text-green-300">
                                  <BookOpen className="h-3 w-3 mr-1" />
                                  Read
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="line-clamp-1">
                              {chapter.title}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              {chapter.page_count && (
                                <div className="flex items-center">
                                  <FileText className="h-3 w-3 mr-1" />
                                  {chapter.page_count} pages
                                </div>
                              )}
                              {chapter.release_date && (
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(chapter.release_date).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No chapters available yet.
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manga Reader */}
      {selectedChapter && (
        <MangaReader
          isOpen={showReader}
          onClose={() => setShowReader(false)}
          mangaId={manga.id}
          chapterNumber={selectedChapter.chapter_number}
          chapterTitle={selectedChapter.title}
        />
      )}
    </>
  );
};

export default MangaDetailsDialog;
