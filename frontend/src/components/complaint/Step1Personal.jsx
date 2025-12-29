import React from 'react';
import { useFormContext } from 'react-hook-form';

const Step1Personal = () => {
    const { register, watch, formState: { errors } } = useFormContext();
    const isAnonymous = watch('isAnonymous');

    return (
        <div className="space-y-4">
            <div className="form-control">
                <label className="justify-start gap-3 cursor-pointer label">
                    <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        {...register('isAnonymous')}
                    />
                    <span className="label-text">Submit anonymously</span>
                </label>
            </div>

            {!isAnonymous && (
                <>
                    <div>
                        <label className="label"><span className="label-text">Name (optional)</span></label>
                        <input
                            className={`w-full input input-bordered ${errors.name ? 'input-error' : ''}`}
                            placeholder="Name"
                            {...register('name')}
                        />
                        {errors.name && <span className="text-sm text-error">{errors.name.message}</span>}
                    </div>

                    <div>
                        <label className="label"><span className="label-text">Email *</span></label>
                        <input
                            className={`w-full input input-bordered ${errors.email ? 'input-error' : ''}`}
                            placeholder="Email"
                            {...register('email')}
                        />
                        {errors.email && <span className="text-sm text-error">{errors.email.message}</span>}
                    </div>

                    <div>
                        <label className="label"><span className="label-text">Phone (optional)</span></label>
                        <input
                            className={`w-full input input-bordered ${errors.phone ? 'input-error' : ''}`}
                            placeholder="Phone"
                            {...register('phone')}
                        />
                        {errors.phone && <span className="text-sm text-error">{errors.phone.message}</span>}
                    </div>

                    <div>
                        <label className="label"><span className="label-text">Student ID (optional)</span></label>
                        <input
                            className={`w-full input input-bordered ${errors.studentId ? 'input-error' : ''}`}
                            placeholder="Student ID"
                            {...register('studentId')}
                        />
                        {errors.studentId && <span className="text-sm text-error">{errors.studentId.message}</span>}
                    </div>
                </>
            )}
        </div>
    );
};

export default Step1Personal;
