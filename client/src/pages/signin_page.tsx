import { AuthLayout } from '../components/layout/AuthLayout';
import { SignInForm } from '../components/forms/SignInForm';
import { usePageTitle } from '../hooks/usePageTitle';

export function SignInPage() {
  usePageTitle('Sign In');

  return (
    <AuthLayout title="Sign In">
      <SignInForm />
    </AuthLayout>
  );
}