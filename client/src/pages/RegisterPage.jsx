import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus, User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { registerSchema } from '../validation/schemas';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '+91',
      password: '',
      confirmPassword: '',
      consentGiven: true,
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await registerUser({
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
      });
      toastSuccess('Account created successfully!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toastError(err.response?.data?.error?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-2xl border-[#233554]">
      <div className="space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-extrabold text-white">Create FraudShield Account</h2>
          <p className="text-xs text-slate-400">
            Set up real-time pre-transaction fraud defense and family guardian alerts.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Ramesh Chandra"
            icon={User}
            {...register('fullName')}
            error={errors.fullName?.message}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="ramesh.chandra@example.com"
            icon={Mail}
            {...register('email')}
            error={errors.email?.message}
          />

          <Input
            label="Indian Mobile Number"
            placeholder="+919876543210"
            icon={Phone}
            {...register('phoneNumber')}
            error={errors.phoneNumber?.message}
            helperText="Used for SMS fraud alerts and family SOS synchronization"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <Input
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              icon={Lock}
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />
          </div>

          {/* Consent Agreement */}
          <div className="p-3.5 rounded-xl bg-[#0A192F]/60 border border-[#233554]">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                {...register('consentGiven')}
                className="mt-1 w-4 h-4 text-teal-500 rounded bg-[#112240] border-[#233554] focus:ring-teal-400"
              />
              <span className="text-xs text-slate-300 leading-relaxed">
                I agree to the{' '}
                <Link to="/terms-conditions" className="text-teal-400 hover:underline">
                  Terms of Service
                </Link>{' '}
                and consent to data processing under the{' '}
                <Link to="/privacy-policy" className="text-teal-400 hover:underline">
                  DPDP Privacy Policy
                </Link>
                .
              </span>
            </label>
            {errors.consentGiven && (
              <p className="text-xs text-rose-400 font-medium pl-6 mt-1">
                {errors.consentGiven.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full text-base font-bold shadow-lg shadow-teal-500/20 mt-2"
            isLoading={loading}
            icon={UserPlus}
          >
            Create Free Account
          </Button>
        </form>

        <div className="pt-4 border-t border-[#233554]/70 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-400 font-bold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </Card>
  );
};
