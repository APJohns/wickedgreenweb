export default async function Result({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const url = (await searchParams).url;
  if (url) {
    const res = await fetch(`${process.env.API_URL}/carbon?url=${url}`, {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    });
    console.log(res);
    const data = await res.json();

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
  } else {
    return <p>Something went wrong with the url.</p>;
  }
}
