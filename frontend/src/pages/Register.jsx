import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../utils/validationSchemas';
import api from '../utils/api';
import toast from 'react-hot-toast';
import PrivacyAccessModal from '../components/PrivacyAccessModal';

function Register() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [pendingRegistration, setPendingRegistration] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    // Show privacy modal before registration
    setPendingRegistration(data);
    setShowPrivacyModal(true);
  };

  const handlePrivacyAccept = async () => {
    setShowPrivacyModal(false);

    if (!pendingRegistration) return;

    try {
      // Register the user using centralized API
      const res = await api.post('/auth/register', {
        email: pendingRegistration.email,
        password: pendingRegistration.password
      });

      // Automatically log in the user after registration
      const loginResult = await login(pendingRegistration.email, pendingRegistration.password);
      if (loginResult.success) {
        toast.success('Registration successful! You are now logged in.');
        navigate('/track-complaints');
      } else {
        toast.success('Registration successful! Please login.');
        navigate('/login');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setFormError('root', { message });
      toast.error(message);
    } finally {
      setPendingRegistration(null);
    }
  };

  const handlePrivacyCancel = () => {
    setShowPrivacyModal(false);
    setPendingRegistration(null);
  };

  return (
    <>
      <div className="relative flex flex-col justify-center min-h-screen overflow-hidden mb-9">
        <div className="w-full p-6 m-auto rounded-md shadow-md lg:max-w-md bg-base-100">
          <h1 className="text-3xl font-semibold text-center text-primary">
            Register (Students Only)
          </h1>

          <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div>
              <label className="label">
                <span className="label-text">Email (@famt.ac.in)</span>
              </label>
              <input
                type="email"
                placeholder="Enter your college email"
                className={`w-full input input-bordered ${errors.email ? 'input-error' : 'input-primary'}`}
                {...register('email')}
              />
              {errors.email && (
                <span className="text-sm text-error">{errors.email.message}</span>
              )}
            </div>

            {/* Password */}
            <div className="mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter password"
                className={`w-full input input-bordered ${errors.password ? 'input-error' : 'input-primary'}`}
                {...register('password')}
              />
              {errors.password && (
                <span className="text-sm text-error">{errors.password.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </div>

            {errors.root && (
              <div className="mt-3 text-sm text-center text-red-500">{errors.root.message}</div>
            )}
          </form>

          <p className="mt-8 text-xs font-light text-center text-primary">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      <PrivacyAccessModal
        isOpen={showPrivacyModal}
        onClose={handlePrivacyCancel}
        onAccept={handlePrivacyAccept}
        userRole="student"
      />
    </>
  );
}

export default Register;