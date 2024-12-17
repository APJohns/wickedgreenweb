'use server';

import { TablesUpdate } from '@/database.types';
import { FREQUENCIES } from '@/utils/constants';
import { createClient, getPlan } from '@/utils/supabase/server';
import { encodedRedirect } from '@/utils/utils';

export const createProjectAction = async (formData: FormData) => {
  const name = formData.get('name')?.toString().trim();
  const reportFrequency = formData.get('reportFrequency')?.toString();
  if (!name || name === 'new') {
    return encodedRedirect('error', `/dashboard/projects/new`, 'Invalid project name');
  }
  if (reportFrequency && !FREQUENCIES.includes(reportFrequency)) {
    return encodedRedirect('error', `/dashboard/projects/new`, 'Invalid report frequency');
  }

  const supabase = await createClient();

  const { data, error: urlError } = await supabase.from('projects').select('name');
  if (urlError) {
    console.error(urlError);
  }
  data?.forEach((d) => {
    if (name.toLowerCase() === d.name.toLowerCase()) {
      return encodedRedirect('error', `/dashboard/projects/new`, 'Project with the same name already exists');
    }
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data, error } = await supabase
      .from('projects')
      .insert({ name, report_frequency: reportFrequency, user_id: user.id })
      .select()
      .single();

    if (error) {
      console.error(error);
    }
    return encodedRedirect('success', `/dashboard/projects/${data?.id}/urls/add`, 'Project successfully created');
  } else {
    return encodedRedirect('error', `/dashboard/project/new`, `Couldn't validate user`);
  }
};

export const deleteProjectAction = async (formData: FormData) => {
  const projectID = formData.get('projectID')?.toString().trim();
  if (projectID) {
    const supabase = await createClient();
    const { error } = await supabase.from('projects').delete().eq('id', projectID);
    if (error) {
      return encodedRedirect('error', `/dashboard`, 'Something went wrong deleting your project');
    }
    return encodedRedirect('success', `/dashboard`, 'Project deleted');
  } else {
    return encodedRedirect('error', `/dashboard`, 'Invalid project ID');
  }
};

export const updateProjectAction = async (formData: FormData) => {
  const projectID = formData.get('projectID')?.toString().trim();
  const reportFrequency = formData.get('reportFrequency')?.toString();
  if (reportFrequency && !FREQUENCIES.includes(reportFrequency)) {
    return encodedRedirect('error', `/dashboard/projects/${projectID}/settings`, 'Invalid report frequency');
  }
  if (projectID) {
    const plan = await getPlan();
    const updatedProject: TablesUpdate<'projects'> = {};
    if (reportFrequency) {
      if (reportFrequency === 'daily' && plan === 'free') {
        return encodedRedirect(
          'error',
          `/dashboard/projects/${projectID}/settings`,
          'Daily reports unavailable in free tier'
        );
      }
      updatedProject.report_frequency = reportFrequency;
    }
    const supabase = await createClient();
    const { error } = await supabase.from('projects').update(updatedProject).eq('id', projectID);
    if (error) {
      return encodedRedirect(
        'error',
        `/dashboard/projects/${projectID}/settings`,
        'Something went wrong deleting your project'
      );
    }
    return encodedRedirect('success', `/dashboard/projects/${projectID}/settings`, 'Project settings saved');
  } else {
    return encodedRedirect('error', `/dashboard/projects/${projectID}/settings`, 'Invalid project ID');
  }
};
