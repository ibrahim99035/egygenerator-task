import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { signInSchema, type SignInFormData } from '../../lib/validation';
import { showValidationToasts } from '../../lib/formErrors';
import api, { getApiErrorMessage } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/signin', data);
      login(response.data);
      toast.success('Signed in successfully!');
      navigate('/app');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Invalid email or password'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, showValidationToasts)} noValidate>
      <Input
        id="email"
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        id="password"
        label="Password"
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" isLoading={isLoading}>
        Sign In
      </Button>

      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/signup" className="text-blue-600 hover:underline">
          Sign Up
        </Link>
      </p>
    </form>
  );
}