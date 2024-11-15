import Delete from './delete';

export default async function SettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const projectID = (await params).id;
  return (
    <>
      <h1>Settings</h1>
      <h2>Danger zone</h2>
      <Delete projectID={projectID} />
    </>
  );
}
