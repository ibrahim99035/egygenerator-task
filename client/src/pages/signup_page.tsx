import { AuthLayout } from '../components/layout/AuthLayout';
import { SignUpForm } from '../components/forms/SignUpForm';
import { usePageTitle } from '../hooks/usePageTitle';

export function SignUpPage() {
  usePageTitle('Sign Up');

  return (
    <AuthLayout title="Create Account">
      <SignUpForm />
    </AuthLayout>
  );
}