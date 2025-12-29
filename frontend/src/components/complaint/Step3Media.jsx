import React, { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';

const Step3Media = () => {
    const { setValue, watch } = useFormContext();
    const mediaFiles = watch('mediaFiles') || [];
    const voiceBlob = watch('voiceBlob');

    // Voice recording logic
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const [recording, setRecording] = useState(false);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;
            chunksRef.current = [];
            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };
            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setValue('voiceBlob', blob); // Store in form state
                stream.getTracks().forEach((t) => t.stop());
            };
            recorder.start();
            setRecording(true);
        } catch (err) {
            toast.error('Cannot access microphone');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    const maxFileSize = 10 * 1024 * 1024; // 10MB

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 5) {
            toast.error('Maximum 5 files allowed');
            return;
        }

        const validFiles = files.filter(f => {
            const isValidType = /^(image\/(jpeg|png|gif|webp|bmp|svg\+xml)|application\/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document))$/.test(f.type || '');
            const isValidSize = f.size <= maxFileSize;
            if (!isValidType) toast.error(`Invalid type: ${f.name}`);
            if (!isValidSize) toast.error(`Too large: ${f.name}`);
            return isValidType && isValidSize;
        });

        setValue('mediaFiles', validFiles);
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="label">
                    <span className="label-text">Media Files (optional)</span>
                    <span className="label-text-alt">Max 5 files, 10MB each</span>
                </label>
                <input
                    type="file"
                    multiple
                    accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="w-full file-input file-input-bordered"
                    onChange={handleFileChange}
                />
                <div className="text-sm text-gray-500 mt-1">
                    Supported: Images, PDF, DOC, DOCX
                </div>

                {mediaFiles.length > 0 && (
                    <div className="mt-2 space-y-1">
                        {mediaFiles.map((f, i) => (
                            <div key={i} className="badge badge-outline gap-2 mr-2">
                                {f.name}
                                <button type="button" className="btn btn-ghost btn-xs text-error" onClick={() => {
                                    setValue('mediaFiles', mediaFiles.filter((_, idx) => idx !== i));
                                }}>×</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <label className="label">
                    <span className="label-text">Voice Note (optional)</span>
                </label>
                <div className="flex items-center gap-3">
                    {!recording ? (
                        <button type="button" className="btn btn-outline" onClick={startRecording}>
                            <span className="mr-2">🎤</span> Record Voice
                        </button>
                    ) : (
                        <button type="button" className="btn btn-error" onClick={stopRecording}>
                            <span className="mr-2">⏹</span> Stop Recording
                        </button>
                    )}

                    {voiceBlob && (
                        <div className="flex items-center gap-2 text-success">
                            <span>✅ Voice note recorded</span>
                            <button type="button" className="btn btn-ghost btn-xs text-error" onClick={() => setValue('voiceBlob', null)}>
                                Clear
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Step3Media;
