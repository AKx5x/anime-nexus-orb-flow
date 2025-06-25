
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAnime = () => {
  return useQuery({
    queryKey: ['anime'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('anime')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useAnimeById = (id: string) => {
  return useQuery({
    queryKey: ['anime', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('anime')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};
