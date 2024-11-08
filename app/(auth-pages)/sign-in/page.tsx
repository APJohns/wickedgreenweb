import { signInAction } from '@/app/actions';
import { FormMessage, Message } from '@/components/formMessage';
import Link from 'next/link';

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return (
    <form action={signInAction}>
      <h1>Sign in</h1>
      <p>
        Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
      </p>
      <div>
        <label className="form-control">
          <div className="form-control-label">Email</div>
          <input name="email" placeholder="you@example.com" required />
        </label>
        <label className="form-control">
          <div className="form-control-label">Password</div>
          <input type="password" name="password" required />
        </label>
        <Link href="/forgot-password">Forgot Password?</Link>
        <button type="submit" className="form-submit">
          Sign in
        </button>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
