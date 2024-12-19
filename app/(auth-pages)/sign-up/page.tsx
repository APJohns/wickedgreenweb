import { signUpAction } from '@/app/actions/auth';
import { FormMessage, Message } from '@/components/formMessage';
import PwRequirements from '@/components/pwRequirements';
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
      <label className="form-control">
        <div className="form-control-label">Email</div>
        <input type="email" className="form-control-input inline" name="email" placeholder="you@example.com" required />
      </label>
      <label className="form-control">
        <div className="form-control-label">Password</div>
        <input type="password" className="form-control-input inline" name="password" minLength={8} required />
      </label>
      <label className="form-control">
        <div className="form-control-label">Confirm password</div>
        <input type="password" className="form-control-input inline" name="confirm_password" minLength={8} required />
      </label>
      <PwRequirements />
      <button type="submit" className="form-submit">
        Sign up
      </button>
      <FormMessage message={searchParams} />
    </form>
  );
}
