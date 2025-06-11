import { resetPasswordAction } from '@/app/actions/auth';
import { FormMessage, Message } from '@/components/formMessage';
import PwRequirements from '@/components/pwRequirements';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset password | Wicked Green Web',
};

export default async function ResetPassword(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <main className="page-padding page-padding-v">
      <form action={resetPasswordAction}>
        <h1>Reset password</h1>
        <p>Please enter your new password below.</p>
        <label className="form-control">
          <div className="form-control-label">New password</div>
          <input type="password" name="password" minLength={8} required />
        </label>
        <label className="form-control">
          <div className="form-control-label">Confirm password</div>
          <input type="password" name="confirmPassword" minLength={8} required />
        </label>
        <PwRequirements />
        <button className="form-submit">Reset password</button>
        <FormMessage message={searchParams} />
      </form>
    </main>
  );
}
