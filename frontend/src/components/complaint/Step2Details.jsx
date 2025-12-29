import React from 'react';
import { useFormContext } from 'react-hook-form';

const categories = ['Infrastructure', 'Faculty', 'Harassment', 'Hostel', 'Mess', 'Admin', 'Other'];

const Step2Details = () => {
    const { register, formState: { errors }, watch } = useFormContext();
    const description = watch('description') || '';
    const wordCount = description.trim().split(/\s+/).filter(Boolean).length;

    return (
        <div className="space-y-4">
            <div>
                <label className="label">
                    <span className="label-text">Category *</span>
                </label>
                <select
                    className="w-full select select-bordered"
                    {...register('category')}
                >
                    {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
                {errors.category && <span className="text-sm text-error">{errors.category.message}</span>}
            </div>

            <div>
                <label className="label">
                    <span className="label-text">Subject *</span>
                </label>
                <input
                    className={`w-full input input-bordered ${errors.subject ? 'input-error' : ''}`}
                    placeholder="Brief subject (3-200 characters)"
                    {...register('subject')}
                    maxLength={200}
                />
                {errors.subject && <span className="text-sm text-error">{errors.subject.message}</span>}
                <div className="text-sm text-gray-500">{(watch('subject') || '').length}/200 characters</div>
            </div>

            <div>
                <label className="label">
                    <span className="label-text">Detailed description (50-1000 words) *</span>
                    <span className={`label-text-alt ${wordCount < 50 ? 'text-error' : wordCount > 1000 ? 'text-warning' : 'text-success'
                        }`}>
                        {wordCount} words
                    </span>
                </label>
                <textarea
                    className={`w-full textarea textarea-bordered min-h-40 ${errors.description ? 'textarea-error' : ''}`}
                    placeholder="Describe the issue in detail... (minimum 50 words required)"
                    {...register('description')}
                />
                {errors.description && (
                    <span className="text-sm text-error">{errors.description.message}</span>
                )}
            </div>

            <div>
                <label className="label">
                    <span className="label-text">Tags (optional)</span>
                </label>
                <input
                    className={`w-full input input-bordered ${errors.tags ? 'input-error' : ''}`}
                    placeholder="Tags (comma separated)"
                    {...register('tags')}
                />
                {errors.tags && <span className="text-sm text-error">{errors.tags.message}</span>}
            </div>
        </div>
    );
};

export default Step2Details;
