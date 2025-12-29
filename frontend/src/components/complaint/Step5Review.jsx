import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import parse from 'html-react-parser';
import PrivacyAccessModal from '../PrivacyAccessModal';

const Step5Review = () => {
    const { watch, register, formState: { errors } } = useFormContext();
    const values = watch();
    const [showPrivacyHelp, setShowPrivacyHelp] = useState(false);

    return (
        <div className="space-y-4">
            <div className="card bg-base-200">
                <div className="card-body">
                    <h3 className="card-title">Review</h3>
                    <p><strong>Anonymous:</strong> {values.isAnonymous ? 'Yes' : 'No'}</p>
                    {!values.isAnonymous && (
                        <>
                            <p><strong>Name:</strong> {values.name}</p>
                            <p><strong>Email:</strong> {values.email}</p>
                            <p><strong>Phone:</strong> {values.phone}</p>
                            <p><strong>Student ID:</strong> {values.studentId}</p>
                        </>
                    )}
                    <p><strong>Category:</strong> {values.category}</p>
                    <p><strong>Subject:</strong> {values.subject}</p>
                    <div className="prose whitespace-pre-wrap max-w-none bg-base-100 p-2 rounded">
                        {values.description}
                    </div>
                    <p><strong>Tags:</strong> {values.tags}</p>
                    <p><strong>Media:</strong> {values.mediaFiles?.length || 0} file(s)</p>
                    <p><strong>Voice:</strong> {values.voiceBlob ? 'Recorded' : 'None'}</p>
                    <p><strong>Location:</strong> {[values.building, values.block, values.room].filter(Boolean).join(' / ')}</p>

                    <div className="form-control mt-4">
                        <label className="justify-start gap-3 cursor-pointer label">
                            <input
                                type="checkbox"
                                className="checkbox checkbox-primary"
                                {...register('privacyAgreed')}
                            />
                            <span className="label-text">I agree to the privacy policy</span>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline btn-ghost ml-2"
                                onClick={() => setShowPrivacyHelp(true)}
                            >
                                (View Policy)
                            </button>
                        </label>
                        {errors.privacyAgreed && <span className="text-sm text-error">{errors.privacyAgreed.message}</span>}
                    </div>
                </div>
            </div>

            <PrivacyAccessModal
                isOpen={showPrivacyHelp}
                onClose={() => setShowPrivacyHelp(false)}
                onAccept={() => setShowPrivacyHelp(false)}
                userRole="student"
            />
        </div>
    );
};

export default Step5Review;
