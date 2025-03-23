'use server';

import { createClient } from '@/utils/supabase/server';

export const getBatches = async (projectID: string) => {
  const supabase = await createClient();
  const { data: batches } = await supabase
    .from('batches')
    .select()
    .eq('project_id', projectID)
    .order('created_at', { ascending: false });
  return batches;
};
