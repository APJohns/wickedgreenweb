import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main>
      <h1>Account</h1>
      <dl>
        <dt>Email</dt>
        <dd>{user?.email}</dd>
      </dl>
      <Link href="account/reset-password">Reset password</Link>
    </main>
  );
}
