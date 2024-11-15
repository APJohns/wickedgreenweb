import { createProjectAction } from '@/app/actions';
import { FormMessage, Message } from '@/components/formMessage';

export default async function NewProjectPage(props: {
  searchParams: Promise<Message>;
  params: Promise<{ id: string }>;
}) {
  const searchParams = await props.searchParams;
  return (
    <main>
      <h1>New project</h1>
      <form action={createProjectAction}>
        <label className="form-control">
          <div className="form-control-label">Name</div>
          <input type="text" name="name" />
        </label>
        <label className="form-control">
          <div className="form-control-label">Domain</div>
          <input type="url" name="domain" />
        </label>
        <button type="submit" className="form-submit">
          Create project
        </button>
        <FormMessage message={searchParams} />
      </form>
    </main>
  );
}
