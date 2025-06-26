
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MangaReaderProps {
  isOpen: boolean;
  onClose: () => void;
  mangaId: string;
  chapterNumber: number;
  chapterTitle: string;
}

const MangaReader: React.FC<MangaReaderProps> = ({
  isOpen,
  onClose,
  mangaId,
  chapterNumber,
  chapterTitle
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [chapterData, setChapterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && mangaId && chapterNumber) {
      fetchChapter();
    }
  }, [isOpen, mangaId, chapterNumber]);

  const fetchChapter = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('manga_id', mangaId)
      .eq('chapter_number', chapterNumber)
      .single();

    if (!error && data) {
      setChapterData(data);
      setTotalPages(data.page_count || 1);
      setCurrentPage(1);
    }
    setLoading(false);
  };

  const getPageUrl = (pageNumber: number) => {
    if (!chapterData?.google_drive_link) return '';
    // This would need to be implemented based on how you structure your Google Drive folders
    // For now, returning a placeholder
    return `${chapterData.google_drive_link}/page-${pageNumber}.jpg`;
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-full h-[90vh] p-4">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[95vh] p-0 bg-black border-none">
        <div className="relative w-full h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm">
            <div>
              <DialogTitle className="text-white text-lg font-semibold">
                Chapter {chapterNumber}: {chapterTitle}
              </DialogTitle>
              <p className="text-gray-300 text-sm">
                Page {currentPage} of {totalPages}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={prevPage}
                disabled={currentPage <= 1}
                className="text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={nextPage}
                disabled={currentPage >= totalPages}
                className="text-white hover:bg-white/20"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Reader */}
          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src={getPageUrl(currentPage)}
              alt={`Page ${currentPage}`}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>

          {/* Navigation overlay */}
          <div className="absolute inset-0 flex">
            <div 
              className="w-1/2 cursor-pointer flex items-center justify-start pl-8"
              onClick={prevPage}
            >
              {currentPage > 1 && (
                <ChevronLeft className="h-8 w-8 text-white/50 hover:text-white transition-colors" />
              )}
            </div>
            <div 
              className="w-1/2 cursor-pointer flex items-center justify-end pr-8"
              onClick={nextPage}
            >
              {currentPage < totalPages && (
                <ChevronRight className="h-8 w-8 text-white/50 hover:text-white transition-colors" />
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MangaReader;
