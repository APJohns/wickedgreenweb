'use server';

import { createClient } from '@/utils/supabase/server';

export const getThisMonthsManualBatchCount = async (): Promise<number | null> => {
  const today = new Date();
  const supabase = await createClient();
  const { count } = await supabase
    .from('batches')
    .select('*', { count: 'exact', head: true })
    .eq('source', 'manual')
    .gte('created_at', `${today.getFullYear()}-${today.getMonth() + 1}-1`);
  return count;
};
