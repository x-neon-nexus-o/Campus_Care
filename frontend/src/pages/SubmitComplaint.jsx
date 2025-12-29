import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { complaintSchema } from '../utils/validationSchemas';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

import Step1Personal from '../components/complaint/Step1Personal';
import Step2Details from '../components/complaint/Step2Details';
import Step3Media from '../components/complaint/Step3Media';
import Step4Location from '../components/complaint/Step4Location';
import Step5Review from '../components/complaint/Step5Review';

function SubmitComplaint() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const methods = useForm({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      isAnonymous: false,
      category: 'Infrastructure',
      mediaFiles: [],
      voiceBlob: null,
      privacyAgreed: false,
      // Pre-fill user data if available
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      studentId: user?.studentId || '',
    },
    mode: 'onChange' // Validate on change for better UX in steps
  });

  const { handleSubmit, trigger, setValue, watch } = methods;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/submit-complaint' } });
    } else if (user?.role === 'admin') {
      toast.error('Admin users cannot submit complaints');
      navigate('/admin-dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  // Keyboard shortcut for anonymous mode (Feature Parity)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        setValue('isAnonymous', true);
        toast.success('Anonymous mode activated', {
          style: { background: '#333', color: '#fff' }
        });
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setValue]);

  const nextStep = async () => {
    let fieldsToValidate = [];
    if (step === 1) fieldsToValidate = ['email', 'name', 'phone', 'studentId'];
    if (step === 2) fieldsToValidate = ['category', 'subject', 'description', 'tags'];

    // Only validate relevant fields for the current step
    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setStep((s) => Math.min(5, s + 1));
    }
  };

  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const loadingToast = toast.loading('Submitting your complaint...');

      const form = new FormData();
      form.append('isAnonymous', String(data.isAnonymous));

      if (!data.isAnonymous) {
        if (data.name) form.append('name', data.name);
        form.append('email', data.email); // Required
        if (data.phone) form.append('phone', data.phone);
        if (data.studentId) form.append('studentId', data.studentId);
      }

      form.append('category', data.category);
      form.append('subject', data.subject);
      form.append('description', data.description);
      if (data.tags) form.append('tags', data.tags);

      if (data.building) form.append('building', data.building);
      if (data.block) form.append('block', data.block);
      if (data.room) form.append('room', data.room);
      if (data.department) form.append('department', data.department);

      // Media
      if (data.mediaFiles) {
        Array.from(data.mediaFiles).forEach((f) => form.append('media', f));
      }
      if (data.voiceBlob) {
        form.append('voice', data.voiceBlob, 'voice.webm');
      }

      const res = await api.post('/complaints', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.dismiss(loadingToast);

      if (res?.data?.id) {
        toast.success(`Complaint submitted! ID: ${res.data.id}`);
      } else {
        toast.success('Complaint submitted successfully');
      }

      // Redirect
      setTimeout(() => {
        navigate('/track-complaints');
      }, 2000);

    } catch (err) {
      console.error(err);
      toast.dismiss(); // Dismiss loading toast
      toast.error(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  // Render current step
  const renderStep = () => {
    switch (step) {
      case 1: return <Step1Personal />;
      case 2: return <Step2Details />;
      case 3: return <Step3Media />;
      case 4: return <Step4Location />;
      case 5: return <Step5Review />;
      default: return <Step1Personal />;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen pb-10">
      <div className="w-full max-w-3xl p-6 rounded-md shadow bg-base-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Submit a Complaint</h1>
          <button className="btn btn-ghost" onClick={() => navigate('/track-complaints')}>Back to Tracker</button>
        </div>

        {/* Steps Indicator */}
        <div className="w-full mb-8 steps">
          {[1, 2, 3, 4, 5].map((s) => (
            <a key={s} className={`step ${step >= s ? 'step-primary' : ''}`}>{s}</a>
          ))}
        </div>

        {/* Form Content */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>

            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-4 border-t">
              <button
                type="button"
                className="btn"
                disabled={step === 1 || submitting}
                onClick={prevStep}
              >
                Back
              </button>

              {step < 5 ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={nextStep}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting || !watch('privacyAgreed')}
                >
                  {submitting ? 'Submitting...' : 'Submit Complaint'}
                </button>
              )}
            </div>

          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default SubmitComplaint;


