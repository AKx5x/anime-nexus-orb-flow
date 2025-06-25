
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select(`
          *,
          profiles:author_id (
            username,
            display_name
          )
        `)
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
