import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { signUpSchema, type SignUpFormData } from '../../lib/validation';
import { showValidationToasts } from '../../lib/formErrors';
import api, { getApiErrorMessage } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/signup', data);
      login(response.data);
      toast.success('Account created successfully!');
      navigate('/app');
    } catch (err) {
      toast.error(getApiErrorMessage(err));
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
        id="name"
        label="Name"
        type="text"
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        id="password"
        label="Password"
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" isLoading={isLoading}>
        Sign Up
      </Button>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/signin" className="text-blue-600 hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
}