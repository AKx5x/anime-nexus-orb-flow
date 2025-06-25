
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface MangaManagementProps {
  onUpdate: () => void;
}

const MangaManagement: React.FC<MangaManagementProps> = ({ onUpdate }) => {
  const [manga, setManga] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingManga, setEditingManga] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    title_japanese: '',
    title_english: '',
    synopsis: '',
    cover_image: '',
    author: '',
    artist: '',
    chapter_count: '',
    rating: '',
    genres: '',
    status: 'ongoing'
  });

  useEffect(() => {
    fetchManga();
  }, []);

  const fetchManga = async () => {
    const { data, error } = await supabase
      .from('manga')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setManga(data);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      title_japanese: '',
      title_english: '',
      synopsis: '',
      cover_image: '',
      author: '',
      artist: '',
      chapter_count: '',
      rating: '',
      genres: '',
      status: 'ongoing'
    });
    setEditingManga(null);
  };

  const handleEdit = (mangaItem: any) => {
    setEditingManga(mangaItem);
    setFormData({
      title: mangaItem.title || '',
      title_japanese: mangaItem.title_japanese || '',
      title_english: mangaItem.title_english || '',
      synopsis: mangaItem.synopsis || '',
      cover_image: mangaItem.cover_image || '',
      author: mangaItem.author || '',
      artist: mangaItem.artist || '',
      chapter_count: mangaItem.chapter_count?.toString() || '',
      rating: mangaItem.rating?.toString() || '',
      genres: mangaItem.genres?.join(', ') || '',
      status: mangaItem.status || 'ongoing'
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const mangaData = {
      title: formData.title,
      title_japanese: formData.title_japanese || null,
      title_english: formData.title_english || null,
      synopsis: formData.synopsis || null,
      cover_image: formData.cover_image || null,
      author: formData.author || null,
      artist: formData.artist || null,
      chapter_count: formData.chapter_count ? parseInt(formData.chapter_count) : null,
      rating: formData.rating ? parseFloat(formData.rating) : null,
      genres: formData.genres ? formData.genres.split(',').map(g => g.trim()).filter(g => g) : null,
      status: formData.status as any
    };

    let error;
    if (editingManga) {
      const result = await supabase
        .from('manga')
        .update(mangaData)
        .eq('id', editingManga.id);
      error = result.error;
    } else {
      const result = await supabase
        .from('manga')
        .insert(mangaData);
      error = result.error;
    }

    if (error) {
      toast.error('Failed to save manga');
    } else {
      toast.success(editingManga ? 'Manga updated!' : 'Manga created!');
      setDialogOpen(false);
      resetForm();
      fetchManga();
      onUpdate();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this manga?')) return;

    const { error } = await supabase
      .from('manga')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete manga');
    } else {
      toast.success('Manga deleted!');
      fetchManga();
      onUpdate();
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading manga...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manga Management</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-gradient-to-r from-purple-500 to-pink-500">
              <Plus className="h-4 w-4 mr-2" />
              Add Manga
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingManga ? 'Edit Manga' : 'Add New Manga'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title_english">English Title</Label>
                  <Input
                    id="title_english"
                    value={formData.title_english}
                    onChange={(e) => setFormData({ ...formData, title_english: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title_japanese">Japanese Title</Label>
                  <Input
                    id="title_japanese"
                    value={formData.title_japanese}
                    onChange={(e) => setFormData({ ...formData, title_japanese: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="artist">Artist</Label>
                  <Input
                    id="artist"
                    value={formData.artist}
                    onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chapter_count">Chapter Count</Label>
                  <Input
                    id="chapter_count"
                    type="number"
                    value={formData.chapter_count}
                    onChange={(e) => setFormData({ ...formData, chapter_count: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (0-10)</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cover_image">Cover Image URL</Label>
                <Input
                  id="cover_image"
                  value={formData.cover_image}
                  onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genres">Genres (comma-separated)</Label>
                <Input
                  id="genres"
                  value={formData.genres}
                  onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
                  placeholder="Action, Adventure, Drama"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="synopsis">Synopsis</Label>
                <Textarea
                  id="synopsis"
                  value={formData.synopsis}
                  onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                  rows={4}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingManga ? 'Update Manga' : 'Create Manga'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {manga.map((mangaItem) => (
          <Card key={mangaItem.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{mangaItem.title}</CardTitle>
                  <CardDescription>{mangaItem.author}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(mangaItem)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(mangaItem.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {mangaItem.genres?.map((genre: string) => (
                    <Badge key={genre} variant="secondary" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Chapters: {mangaItem.chapter_count || 'N/A'} | Rating: {mangaItem.rating || 'N/A'}
                </p>
                <Badge variant={mangaItem.status === 'completed' ? 'default' : 'outline'}>
                  {mangaItem.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MangaManagement;
