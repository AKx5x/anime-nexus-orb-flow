
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

interface AnimeManagementProps {
  onUpdate: () => void;
}

const AnimeManagement: React.FC<AnimeManagementProps> = ({ onUpdate }) => {
  const [anime, setAnime] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAnime, setEditingAnime] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    title_japanese: '',
    title_english: '',
    synopsis: '',
    cover_image: '',
    studio: '',
    release_year: '',
    episode_count: '',
    rating: '',
    genres: '',
    status: 'ongoing'
  });

  useEffect(() => {
    fetchAnime();
  }, []);

  const fetchAnime = async () => {
    const { data, error } = await supabase
      .from('anime')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setAnime(data);
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
      studio: '',
      release_year: '',
      episode_count: '',
      rating: '',
      genres: '',
      status: 'ongoing'
    });
    setEditingAnime(null);
  };

  const handleEdit = (animeItem: any) => {
    setEditingAnime(animeItem);
    setFormData({
      title: animeItem.title || '',
      title_japanese: animeItem.title_japanese || '',
      title_english: animeItem.title_english || '',
      synopsis: animeItem.synopsis || '',
      cover_image: animeItem.cover_image || '',
      studio: animeItem.studio || '',
      release_year: animeItem.release_year?.toString() || '',
      episode_count: animeItem.episode_count?.toString() || '',
      rating: animeItem.rating?.toString() || '',
      genres: animeItem.genres?.join(', ') || '',
      status: animeItem.status || 'ongoing'
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const animeData = {
      title: formData.title,
      title_japanese: formData.title_japanese || null,
      title_english: formData.title_english || null,
      synopsis: formData.synopsis || null,
      cover_image: formData.cover_image || null,
      studio: formData.studio || null,
      release_year: formData.release_year ? parseInt(formData.release_year) : null,
      episode_count: formData.episode_count ? parseInt(formData.episode_count) : null,
      rating: formData.rating ? parseFloat(formData.rating) : null,
      genres: formData.genres ? formData.genres.split(',').map(g => g.trim()).filter(g => g) : null,
      status: formData.status as any
    };

    let error;
    if (editingAnime) {
      const result = await supabase
        .from('anime')
        .update(animeData)
        .eq('id', editingAnime.id);
      error = result.error;
    } else {
      const result = await supabase
        .from('anime')
        .insert(animeData);
      error = result.error;
    }

    if (error) {
      toast.error('Failed to save anime');
    } else {
      toast.success(editingAnime ? 'Anime updated!' : 'Anime created!');
      setDialogOpen(false);
      resetForm();
      fetchAnime();
      onUpdate();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this anime?')) return;

    const { error } = await supabase
      .from('anime')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete anime');
    } else {
      toast.success('Anime deleted!');
      fetchAnime();
      onUpdate();
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading anime...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Anime Management</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-gradient-to-r from-purple-500 to-pink-500">
              <Plus className="h-4 w-4 mr-2" />
              Add Anime
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingAnime ? 'Edit Anime' : 'Add New Anime'}</DialogTitle>
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
                  <Label htmlFor="studio">Studio</Label>
                  <Input
                    id="studio"
                    value={formData.studio}
                    onChange={(e) => setFormData({ ...formData, studio: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="release_year">Release Year</Label>
                  <Input
                    id="release_year"
                    type="number"
                    value={formData.release_year}
                    onChange={(e) => setFormData({ ...formData, release_year: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="episode_count">Episode Count</Label>
                  <Input
                    id="episode_count"
                    type="number"
                    value={formData.episode_count}
                    onChange={(e) => setFormData({ ...formData, episode_count: e.target.value })}
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
                {editingAnime ? 'Update Anime' : 'Create Anime'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {anime.map((animeItem) => (
          <Card key={animeItem.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{animeItem.title}</CardTitle>
                  <CardDescription>{animeItem.studio}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(animeItem)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(animeItem.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {animeItem.genres?.map((genre: string) => (
                    <Badge key={genre} variant="secondary" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Episodes: {animeItem.episode_count || 'N/A'} | Rating: {animeItem.rating || 'N/A'}
                </p>
                <Badge variant={animeItem.status === 'completed' ? 'default' : 'outline'}>
                  {animeItem.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AnimeManagement;
