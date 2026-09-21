import { useAuth } from '../context/AuthContext';
import { AppLayout } from '../components/layout/AppLayout';
import { LogoutButton } from '../components/auth/LogoutButton';
import { usePageTitle } from '../hooks/usePageTitle';

export function ApplicationPage() {
  const { user } = useAuth();
  usePageTitle(user ? `Welcome, ${user.name}` : 'Dashboard');

  return (
    <AppLayout>
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome to the application.
        </h1>
        {user && (
          <p className="text-gray-600 mb-6">
            Hello, <span className="font-medium">{user.name}</span>!
          </p>
        )}
        <LogoutButton />
      </div>
    </AppLayout>
  );
}