import { addURLAction } from '@/app/actions';
import { FormMessage, Message } from '@/components/formMessage';

export default async function AddUrlPage(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <main>
      <h1>Add URL</h1>
      <form action={addURLAction}>
        <label className="form-control">
          <div className="form-control-label">Url</div>
          <input type="url" name="url" />
        </label>
        <button type="submit" className="form-submit">
          Add
        </button>
        <FormMessage message={searchParams} />
      </form>
    </main>
  );
}
