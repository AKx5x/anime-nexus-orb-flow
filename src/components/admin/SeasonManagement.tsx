
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Play } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SeasonManagementProps {
  onUpdate: () => void;
}

const SeasonManagement: React.FC<SeasonManagementProps> = ({ onUpdate }) => {
  const [seasons, setSeasons] = useState<any[]>([]);
  const [anime, setAnime] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSeason, setEditingSeason] = useState<any>(null);
  const [formData, setFormData] = useState({
    anime_id: '',
    season_number: '',
    title: '',
    description: '',
    cover_image: '',
    release_year: '',
  });

  useEffect(() => {
    fetchSeasons();
    fetchAnime();
  }, []);

  const fetchSeasons = async () => {
    const { data, error } = await supabase
      .from('seasons')
      .select(`
        *,
        anime:anime_id (
          title,
          cover_image
        )
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSeasons(data);
    }
    setLoading(false);
  };

  const fetchAnime = async () => {
    const { data, error } = await supabase
      .from('anime')
      .select('id, title')
      .order('title');

    if (!error && data) {
      setAnime(data);
    }
  };

  const resetForm = () => {
    setFormData({
      anime_id: '',
      season_number: '',
      title: '',
      description: '',
      cover_image: '',
      release_year: '',
    });
    setEditingSeason(null);
  };

  const handleEdit = (season: any) => {
    setEditingSeason(season);
    setFormData({
      anime_id: season.anime_id || '',
      season_number: season.season_number?.toString() || '',
      title: season.title || '',
      description: season.description || '',
      cover_image: season.cover_image || '',
      release_year: season.release_year?.toString() || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const seasonData = {
      anime_id: formData.anime_id,
      season_number: parseInt(formData.season_number),
      title: formData.title,
      description: formData.description || null,
      cover_image: formData.cover_image || null,
      release_year: formData.release_year ? parseInt(formData.release_year) : null,
    };

    let error;
    if (editingSeason) {
      const result = await supabase
        .from('seasons')
        .update(seasonData)
        .eq('id', editingSeason.id);
      error = result.error;
    } else {
      const result = await supabase
        .from('seasons')
        .insert(seasonData);
      error = result.error;
    }

    if (error) {
      toast.error('Failed to save season');
    } else {
      toast.success(editingSeason ? 'Season updated!' : 'Season created!');
      setDialogOpen(false);
      resetForm();
      fetchSeasons();
      onUpdate();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this season?')) return;

    const { error } = await supabase
      .from('seasons')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete season');
    } else {
      toast.success('Season deleted!');
      fetchSeasons();
      onUpdate();
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading seasons...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Season Management</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-gradient-to-r from-purple-500 to-pink-500">
              <Plus className="h-4 w-4 mr-2" />
              Add Season
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingSeason ? 'Edit Season' : 'Add New Season'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="anime_id">Anime *</Label>
                  <Select 
                    value={formData.anime_id} 
                    onValueChange={(value) => setFormData({ ...formData, anime_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select anime" />
                    </SelectTrigger>
                    <SelectContent>
                      {anime.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="season_number">Season Number *</Label>
                  <Input
                    id="season_number"
                    type="number"
                    value={formData.season_number}
                    onChange={(e) => setFormData({ ...formData, season_number: e.target.value })}
                    required
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
                  <Label htmlFor="release_year">Release Year</Label>
                  <Input
                    id="release_year"
                    type="number"
                    value={formData.release_year}
                    onChange={(e) => setFormData({ ...formData, release_year: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cover_image">Cover Image URL</Label>
                  <Input
                    id="cover_image"
                    value={formData.cover_image}
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingSeason ? 'Update Season' : 'Create Season'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {seasons.map((season) => (
          <Card key={season.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{season.title}</CardTitle>
                  <CardDescription>
                    {season.anime?.title} - Season {season.season_number}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(season)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(season.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Episodes: {season.episode_count || 0}
                </p>
                {season.release_year && (
                  <p className="text-sm text-muted-foreground">
                    Year: {season.release_year}
                  </p>
                )}
                {season.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {season.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SeasonManagement;
