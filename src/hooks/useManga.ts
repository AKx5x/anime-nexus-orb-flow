
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useManga = () => {
  return useQuery({
    queryKey: ['manga'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('manga')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useMangaById = (id: string) => {
  return useQuery({
    queryKey: ['manga', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('manga')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};
