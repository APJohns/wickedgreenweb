import { addURLAction } from '@/app/actions';
import { FormMessage, Message } from '@/components/formMessage';

export default async function AddUrlPage(props: { searchParams: Promise<Message>; params: Promise<{ id: string }> }) {
  const searchParams = await props.searchParams;
  const projectID = (await props.params).id;
  return (
    <>
      <h1>Add URL</h1>
      <form action={addURLAction}>
        <label className="form-control">
          <div className="form-control-label">Url</div>
          <input type="url" name="url" />
        </label>
        <input type="hidden" name="project_id" value={projectID} />
        <button type="submit" className="form-submit">
          Add
        </button>
        <FormMessage message={searchParams} />
      </form>
    </>
  );
}
