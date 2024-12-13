import { forgotPasswordAction } from '@/app/actions/auth';
import { FormMessage, Message } from '@/components/formMessage';
import Link from 'next/link';

export default async function ForgotPassword(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <>
      <form action={forgotPasswordAction}>
        <div>
          <h1>Reset Password</h1>
          <p>
            Already have an account? <Link href="/sign-in">Sign in</Link>
          </p>
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input name="email" placeholder="you@example.com" required />
          <button type="submit">Reset Password</button>
          <FormMessage message={searchParams} />
        </div>
      </form>
      {/* <SmtpMessage /> */}
    </>
  );
}
