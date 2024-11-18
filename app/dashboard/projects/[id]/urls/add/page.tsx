import { addURLAction } from '@/app/actions';
import { FormMessage, Message } from '@/components/formMessage';
import styles from './add.module.css';

export default async function AddUrlPage(props: { searchParams: Promise<Message>; params: Promise<{ id: string }> }) {
  const searchParams = await props.searchParams;
  const projectID = (await props.params).id;
  return (
    <>
      <h1>Add URL</h1>
      <form action={addURLAction}>
        <label className="form-control">
          <div className="form-control-label">Single URL</div>
          <input type="url" name="url" className="form-control-input" />
        </label>
        <input type="hidden" name="project_id" value={projectID} />
        <button type="submit" className="form-submit">
          Add
        </button>
      </form>
      <div className={styles.or}>OR</div>
      <form action={addURLAction}>
        <label className="form-control">
          <div className="form-control-label">Multiple URLs from a sitemap</div>
          <textarea name="sitemap" className={`form-control-input ${styles.sitemapTextarea}`} />
        </label>
        <input type="hidden" name="project_id" value={projectID} />
        <button type="submit" className="form-submit">
          Add
        </button>
      </form>
      <FormMessage message={searchParams} />
    </>
  );
}
