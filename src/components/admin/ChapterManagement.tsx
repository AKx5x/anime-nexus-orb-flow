
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, BookOpen, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ChapterManagementProps {
  onUpdate: () => void;
}

const ChapterManagement: React.FC<ChapterManagementProps> = ({ onUpdate }) => {
  const [chapters, setChapters] = useState<any[]>([]);
  const [manga, setManga] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<any>(null);
  const [formData, setFormData] = useState({
    manga_id: '',
    chapter_number: '',
    title: '',
    google_drive_link: '',
    thumbnail: '',
    release_date: '',
    page_count: '',
  });

  useEffect(() => {
    fetchChapters();
    fetchManga();
  }, []);

  const fetchChapters = async () => {
    const { data, error } = await supabase
      .from('chapters')
      .select(`
        *,
        manga:manga_id (
          title
        )
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setChapters(data);
    }
    setLoading(false);
  };

  const fetchManga = async () => {
    const { data, error } = await supabase
      .from('manga')
      .select('id, title')
      .order('title');

    if (!error && data) {
      setManga(data);
    }
  };

  const resetForm = () => {
    setFormData({
      manga_id: '',
      chapter_number: '',
      title: '',
      google_drive_link: '',
      thumbnail: '',
      release_date: '',
      page_count: '',
    });
    setEditingChapter(null);
  };

  const handleEdit = (chapter: any) => {
    setEditingChapter(chapter);
    setFormData({
      manga_id: chapter.manga_id || '',
      chapter_number: chapter.chapter_number?.toString() || '',
      title: chapter.title || '',
      google_drive_link: chapter.google_drive_link || '',
      thumbnail: chapter.thumbnail || '',
      release_date: chapter.release_date || '',
      page_count: chapter.page_count?.toString() || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const chapterData = {
      manga_id: formData.manga_id,
      chapter_number: parseInt(formData.chapter_number),
      title: formData.title,
      google_drive_link: formData.google_drive_link || null,
      thumbnail: formData.thumbnail || null,
      release_date: formData.release_date || null,
      page_count: formData.page_count ? parseInt(formData.page_count) : null,
    };

    let error;
    if (editingChapter) {
      const result = await supabase
        .from('chapters')
        .update(chapterData)
        .eq('id', editingChapter.id);
      error = result.error;
    } else {
      const result = await supabase
        .from('chapters')
        .insert(chapterData);
      error = result.error;
    }

    if (error) {
      toast.error('Failed to save chapter');
    } else {
      toast.success(editingChapter ? 'Chapter updated!' : 'Chapter created!');
      setDialogOpen(false);
      resetForm();
      fetchChapters();
      onUpdate();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this chapter?')) return;

    const { error } = await supabase
      .from('chapters')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete chapter');
    } else {
      toast.success('Chapter deleted!');
      fetchChapters();
      onUpdate();
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading chapters...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Chapter Management</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-gradient-to-r from-purple-500 to-pink-500">
              <Plus className="h-4 w-4 mr-2" />
              Add Chapter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingChapter ? 'Edit Chapter' : 'Add New Chapter'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="manga_id">Manga *</Label>
                  <Select 
                    value={formData.manga_id} 
                    onValueChange={(value) => setFormData({ ...formData, manga_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select manga" />
                    </SelectTrigger>
                    <SelectContent>
                      {manga.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chapter_number">Chapter Number *</Label>
                  <Input
                    id="chapter_number"
                    type="number"
                    value={formData.chapter_number}
                    onChange={(e) => setFormData({ ...formData, chapter_number: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="page_count">Page Count</Label>
                  <Input
                    id="page_count"
                    type="number"
                    value={formData.page_count}
                    onChange={(e) => setFormData({ ...formData, page_count: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="release_date">Release Date</Label>
                  <Input
                    id="release_date"
                    type="date"
                    value={formData.release_date}
                    onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail URL</Label>
                  <Input
                    id="thumbnail"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="google_drive_link">Google Drive Link *</Label>
                <Input
                  id="google_drive_link"
                  value={formData.google_drive_link}
                  onChange={(e) => setFormData({ ...formData, google_drive_link: e.target.value })}
                  placeholder="https://drive.google.com/drive/folders/..."
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editingChapter ? 'Update Chapter' : 'Create Chapter'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chapters.map((chapter) => (
          <Card key={chapter.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Chapter {chapter.chapter_number}</CardTitle>
                  <CardDescription className="line-clamp-1">
                    {chapter.manga?.title}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(chapter)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(chapter.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-medium line-clamp-1">{chapter.title}</h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {chapter.page_count && (
                    <Badge variant="outline">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {chapter.page_count} pages
                    </Badge>
                  )}
                  {chapter.release_date && (
                    <Badge variant="outline">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(chapter.release_date).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
                {chapter.google_drive_link && (
                  <Badge className="bg-green-500/20 text-green-700 dark:text-green-300">
                    Drive Link Ready
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChapterManagement;
