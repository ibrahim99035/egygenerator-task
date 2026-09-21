import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('You have been signed out.');
    navigate('/signin');
  };

  return (
    <Button
      variant="danger"
      size="sm"
      onClick={handleLogout}
      className="mx-auto block"
    >
      Logout
    </Button>
  );
}