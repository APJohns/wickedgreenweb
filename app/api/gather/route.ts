import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  const url = 'https://ashpjohns.com';
  const res = await fetch(`${process.env.API_URL}/carbon?url=${url}`, {
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  });
  const data = await res.json();

  return Response.json(data);
}