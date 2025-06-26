
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Play, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EpisodeManagementProps {
  onUpdate: () => void;
}

const EpisodeManagement: React.FC<EpisodeManagementProps> = ({ onUpdate }) => {
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [seasons, setSeasons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<any>(null);
  const [formData, setFormData] = useState({
    season_id: '',
    episode_number: '',
    title: '',
    description: '',
    google_drive_link: '',
    thumbnail: '',
    air_date: '',
    duration: '',
  });

  useEffect(() => {
    fetchEpisodes();
    fetchSeasons();
  }, []);

  const fetchEpisodes = async () => {
    const { data, error } = await supabase
      .from('episodes')
      .select(`
        *,
        seasons:season_id (
          title,
          season_number,
          anime:anime_id (
            title
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setEpisodes(data);
    }
    setLoading(false);
  };

  const fetchSeasons = async () => {
    const { data, error } = await supabase
      .from('seasons')
      .select(`
        id,
        title,
        season_number,
        anime:anime_id (
          title
        )
      `)
      .order('title');

    if (!error && data) {
      setSeasons(data);
    }
  };

  const resetForm = () => {
    setFormData({
      season_id: '',
      episode_number: '',
      title: '',
      description: '',
      google_drive_link: '',
      thumbnail: '',
      air_date: '',
      duration: '',
    });
    setEditingEpisode(null);
  };

  const handleEdit = (episode: any) => {
    setEditingEpisode(episode);
    setFormData({
      season_id: episode.season_id || '',
      episode_number: episode.episode_number?.toString() || '',
      title: episode.title || '',
      description: episode.description || '',
      google_drive_link: episode.google_drive_link || '',
      thumbnail: episode.thumbnail || '',
      air_date: episode.air_date || '',
      duration: episode.duration?.toString() || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const episodeData = {
      season_id: formData.season_id,
      episode_number: parseInt(formData.episode_number),
      title: formData.title,
      description: formData.description || null,
      google_drive_link: formData.google_drive_link || null,
      thumbnail: formData.thumbnail || null,
      air_date: formData.air_date || null,
      duration: formData.duration ? parseInt(formData.duration) : null,
    };

    let error;
    if (editingEpisode) {
      const result = await supabase
        .from('episodes')
        .update(episodeData)
        .eq('id', editingEpisode.id);
      error = result.error;
    } else {
      const result = await supabase
        .from('episodes')
        .insert(episodeData);
      error = result.error;
    }

    if (error) {
      toast.error('Failed to save episode');
    } else {
      toast.success(editingEpisode ? 'Episode updated!' : 'Episode created!');
      setDialogOpen(false);
      resetForm();
      fetchEpisodes();
      onUpdate();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this episode?')) return;

    const { error } = await supabase
      .from('episodes')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete episode');
    } else {
      toast.success('Episode deleted!');
      fetchEpisodes();
      onUpdate();
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading episodes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Episode Management</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-gradient-to-r from-purple-500 to-pink-500">
              <Plus className="h-4 w-4 mr-2" />
              Add Episode
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEpisode ? 'Edit Episode' : 'Add New Episode'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="season_id">Season *</Label>
                  <Select 
                    value={formData.season_id} 
                    onValueChange={(value) => setFormData({ ...formData, season_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select season" />
                    </SelectTrigger>
                    <SelectContent>
                      {seasons.map((season) => (
                        <SelectItem key={season.id} value={season.id}>
                          {season.anime?.title} - {season.title} (S{season.season_number})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="episode_number">Episode Number *</Label>
                  <Input
                    id="episode_number"
                    type="number"
                    value={formData.episode_number}
                    onChange={(e) => setFormData({ ...formData, episode_number: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
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
                  <Label htmlFor="air_date">Air Date</Label>
                  <Input
                    id="air_date"
                    type="date"
                    value={formData.air_date}
                    onChange={(e) => setFormData({ ...formData, air_date: e.target.value })}
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
                  placeholder="https://drive.google.com/file/d/..."
                  required
                />
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
                {editingEpisode ? 'Update Episode' : 'Create Episode'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {episodes.map((episode) => (
          <Card key={episode.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Episode {episode.episode_number}</CardTitle>
                  <CardDescription className="line-clamp-1">
                    {episode.seasons?.anime?.title} - {episode.seasons?.title}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(episode)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(episode.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-medium line-clamp-1">{episode.title}</h4>
                {episode.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {episode.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {episode.duration && (
                    <Badge variant="outline">
                      <Play className="h-3 w-3 mr-1" />
                      {episode.duration}min
                    </Badge>
                  )}
                  {episode.air_date && (
                    <Badge variant="outline">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(episode.air_date).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
                {episode.google_drive_link && (
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

export default EpisodeManagement;
