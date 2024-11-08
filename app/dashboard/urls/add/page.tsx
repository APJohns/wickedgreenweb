import { addURLAction } from '@/app/actions';
import { FormMessage, Message } from '@/components/formMessage';
import Link from 'next/link';

export default async function AddUrlPage(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <main>
      <h1>Add URL</h1>
      <Link href="/dashboard/urls" className="icon-action">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back to URLs
      </Link>
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
