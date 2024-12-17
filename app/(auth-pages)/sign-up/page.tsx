import { signUpAction } from '@/app/actions/auth';
import { FormMessage, Message } from '@/components/formMessage';
import Link from 'next/link';

export default async function Singup(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  if ('message' in searchParams) {
    return <FormMessage message={searchParams} />;
  }

  return (
    <form action={signUpAction}>
      <h1>Sign up</h1>
      <p>
        Already have an account? <Link href="/sign-in">Sign in</Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <label className="form-control">
          <div className="form-control-label">Email</div>
          <input name="email" placeholder="you@example.com" required />
        </label>
        <label className="form-control">
          <div className="form-control-label">Password</div>
          <input type="password" name="password" minLength={6} required />
        </label>
        <button type="submit" className="form-submit">
          Sign up
        </button>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
