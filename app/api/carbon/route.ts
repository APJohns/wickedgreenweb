import carbonCapture from '@/app/carbonCapture';
import { NextRequest } from 'next/server';

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  console.log('GET Carbon');
  const auth = request.headers.get('Authorization');
  if (auth === `Bearer ${process.env.API_TOKEN}`) {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');
    console.log(url);
    if (url) {
      const carbon = await carbonCapture(url);
      return Response.json(carbon);
    } else {
      return new Response('Invalid url parameter', { status: 400 });
    }
  } else {
    return new Response('Invalid auth token', { status: 401 });
  }
}
