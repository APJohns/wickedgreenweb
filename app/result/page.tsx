export default async function Result({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const url = (await searchParams).url;
  const res = await fetch(`${process.env.API_URL}/carbon?url=${url}`, {
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  });
  const data = await res.json();
  console.log(data);

  return (
    <main>
      <dl>
        <dt>
          CO<sub>2</sub>
        </dt>
        <dd>{data.co2.toFixed(3)}</dd>
        <dt>Bytes Transferred</dt>
        <dd>{data.variables.bytes}</dd>
      </dl>
    </main>
  );
}
