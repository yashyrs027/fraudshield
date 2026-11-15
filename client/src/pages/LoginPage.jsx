import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn, Mail, Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { loginSchema } from '../validation/schemas';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const LoginPage = () => {
  const { login } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loadDemoUser = () => {
    setValue('email', 'ramesh.chandra@example.com');
    setValue('password', 'SecurePassword#2026');
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await login(data.email, data.password);
      toastSuccess('Successfully authenticated.');
      navigate(from, { replace: true });
    } catch (err) {
      toastError(err.response?.data?.error?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-2xl border-[#233554]">
      <div className="space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-extrabold text-white">Sign in to FraudShield</h2>
          <p className="text-xs text-slate-400">
            Access your threat history, family guardians, and incident logs.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="ramesh.chandra@example.com"
            icon={Mail}
            {...register('email')}
            error={errors.email?.message}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              icon={Lock}
              {...register('password')}
              error={errors.password?.message}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-9 text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full text-base font-bold shadow-lg shadow-teal-500/20 mt-2"
            isLoading={loading}
            icon={LogIn}
          >
            Sign In
          </Button>

          {/* Demo User Fast Filler */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={loadDemoUser}
              className="text-xs text-teal-400 hover:underline font-semibold"
            >
              Click here to load Demo Senior Citizen account
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-[#233554]/70 text-center text-xs text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-teal-400 font-bold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </Card>
  );
};
