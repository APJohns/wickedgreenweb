import { resetPasswordAction } from '@/app/actions';
import { FormMessage, Message } from '@/components/formMessage';

export default async function ResetPassword(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <main>
      <form action={resetPasswordAction}>
        <h1>Reset password</h1>
        <p>Please enter your new password below.</p>
        <label className="form-control">
          <div className="form-control-label">New password</div>
          <input type="password" name="password" required />
        </label>
        <label className="form-control">
          <div className="form-control-label">Confirm password</div>
          <input type="password" name="confirmPassword" required />
        </label>
        <button className="form-submit">Reset password</button>
        <FormMessage message={searchParams} />
      </form>
    </main>
  );
}
