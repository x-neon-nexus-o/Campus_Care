import { useEffect, useMemo, useRef, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
// Using a simple textarea for description to avoid React 19 + react-quill incompatibility
import toast from 'react-hot-toast';
import PrivacyAccessModal from '../components/PrivacyAccessModal';

const categories = ['Infrastructure', 'Faculty', 'Harassment', 'Hostel', 'Mess', 'Admin', 'Other'];
const departments = ['Computer', 'IT', 'Mechanical', 'Civil', 'Electrical', 'Admin'];
const buildings = ['Main', 'Library', 'Hostel', 'Workshop'];

function SubmitComplaint() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1: Personal
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [studentId, setStudentId] = useState('');

  // Step 2: Details
  const [category, setCategory] = useState('Infrastructure');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  // Step 3: Media
  const [mediaFiles, setMediaFiles] = useState([]);
  const [voiceBlob, setVoiceBlob] = useState(null);
  const mediaInputRef = useRef(null);

  // Step 4: Context
  const [building, setBuilding] = useState('');
  const [block, setBlock] = useState('');
  const [room, setRoom] = useState('');
  const [department, setDepartment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPrivacyHelp, setShowPrivacyHelp] = useState(false);

  // Voice recording
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    // Optionally autofill from stored profile if available later
  }, []);

  const wordCount = useMemo(() => {
    const text = String(description || '').trim();
    if (!text) return 0;
    return text.split(/\s+/).length;
  }, [description]);

  const canGoNext = useMemo(() => {
    if (step === 1) {
      // Allow proceeding; personal details are optional unless user chooses to provide them
      return true;
    }
    if (step === 2) {
      // Let users proceed with a shorter draft; enforce 200+ words on final submit
      const MIN_WORDS_TO_CONTINUE = 30;
      return subject.trim().length > 0 && category && wordCount >= MIN_WORDS_TO_CONTINUE;
    }
    if (step === 3) {
      return true; // optional
    }
    if (step === 4) {
      return true; // optional
    }
    return true;
  }, [step, isAnonymous, email, phone, studentId, subject, category, wordCount]);

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
        setVoiceBlob(blob);
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

  const onSubmit = async () => {
    if (wordCount < 50) {
      toast.error('Please provide at least 50 words in the description.');
      return;
    }
    try {
      setSubmitting(true);
      const loadingToast = toast.loading('Submitting your complaint...');
      const form = new FormData();
      form.append('isAnonymous', String(isAnonymous));
      if (!isAnonymous) {
        form.append('name', name);
        form.append('email', email);
        form.append('phone', phone);
        form.append('studentId', studentId);
      }
      form.append('category', category);
      form.append('subject', subject);
      form.append('description', description);
      if (tags) form.append('tags', tags);
      if (building) form.append('building', building);
      if (block) form.append('block', block);
      if (room) form.append('room', room);
      if (department) form.append('department', department);

      // Media files
      mediaFiles.forEach((f) => form.append('media', f));
      if (voiceBlob) {
        form.append('voice', voiceBlob, 'voice.webm');
      }

      const res = await api.post('/complaints', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.dismiss(loadingToast);
      toast.success('Complaint submitted');
      if (res?.data?.id) {
        window.alert(`Your complaint was submitted successfully. Reference ID: ${res.data.id}`);
      } else {
        window.alert('Your complaint was submitted successfully.');
      }
      setStep(1);
      // reset
      setIsAnonymous(false);
      setName('');
      setEmail('');
      setPhone('');
      setStudentId('');
      setCategory('Infrastructure');
      setSubject('');
      setDescription('');
      setTags('');
      setMediaFiles([]);
      setVoiceBlob(null);
      setBuilding('');
      setBlock('');
      setRoom('');
      setDepartment('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
      window.alert(err.response?.data?.message || 'Failed to submit');
    }
    finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <div className="space-y-4">
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3">
              <input type="checkbox" className="toggle toggle-primary" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
              <span className="label-text">Submit anonymously</span>
            </label>
          </div>
          {!isAnonymous && (
            <>
              <input className="input input-bordered w-full" placeholder="Name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
              <input className="input input-bordered w-full" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input className="input input-bordered w-full" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <input className="input input-bordered w-full" placeholder="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
            </>
          )}
        </div>
      );
    }
    if (step === 2) {
      return (
        <div className="space-y-4">
          <select className="select select-bordered w-full" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input className="input input-bordered w-full" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          <div>
            <label className="label">
              <span className="label-text">Detailed description (min 50 words)</span>
              <span className="label-text-alt">{wordCount} words</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full min-h-40"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
            />
          </div>
          <input className="input input-bordered w-full" placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
        </div>
      );
    }
    if (step === 3) {
      return (
        <div className="space-y-4">
          <input ref={mediaInputRef} type="file" multiple accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="file-input file-input-bordered w-full" onChange={(e) => setMediaFiles(Array.from(e.target.files || []))} />
          <div className="flex items-center gap-3">
            {!recording ? (
              <button type="button" className="btn btn-outline" onClick={startRecording}>Record voice</button>
            ) : (
              <button type="button" className="btn btn-error" onClick={stopRecording}>Stop</button>
            )}
            {voiceBlob && <span className="text-sm">Voice note ready</span>}
          </div>
        </div>
      );
    }
    if (step === 4) {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <select className="select select-bordered w-full" value={building} onChange={(e) => setBuilding(e.target.value)}>
            <option value="">Select Building</option>
            {buildings.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <input className="input input-bordered w-full" placeholder="Block" value={block} onChange={(e) => setBlock(e.target.value)} />
          <input className="input input-bordered w-full" placeholder="Room" value={room} onChange={(e) => setRoom(e.target.value)} />
          <select className="select select-bordered w-full" value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      );
    }
    // Step 5 Review
    return (
      <div className="space-y-4">
        <div className="card bg-base-200">
          <div className="card-body">
            <h3 className="card-title">Review</h3>
            <p><strong>Anonymous:</strong> {isAnonymous ? 'Yes' : 'No'}</p>
            {!isAnonymous && (
              <>
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Phone:</strong> {phone}</p>
                <p><strong>Student ID:</strong> {studentId}</p>
              </>
            )}
            <p><strong>Category:</strong> {category}</p>
            <p><strong>Subject:</strong> {subject}</p>
            <div className="prose max-w-none whitespace-pre-wrap">{description}</div>
            <p><strong>Tags:</strong> {tags}</p>
            <p><strong>Media:</strong> {mediaFiles.length} file(s)</p>
            <p><strong>Voice:</strong> {voiceBlob ? 'Yes' : 'No'}</p>
            <p><strong>Location:</strong> {[building, block, room].filter(Boolean).join(' / ')} {department && ` | Dept: ${department}`}</p>
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input type="checkbox" className="checkbox checkbox-primary" id="agree" />
                <span className="label-text">I agree to the privacy and policy</span>
                <button 
                  type="button"
                  className="btn btn-sm btn-outline btn-primary"
                  onClick={() => setShowPrivacyHelp(true)}
                >
                  Learn More
                </button>
              </label>
            </div>
            <button className="btn btn-primary" onClick={onSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-3xl p-6 rounded-md shadow bg-base-100">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Submit a Complaint</h1>
          <button className="btn btn-ghost" onClick={()=>navigate('/track-complaints')}>Back to Tracker</button>
        </div>
        <div className="steps w-full mb-6">
          {[1,2,3,4,5].map((s) => (
            <a key={s} className={`step ${step >= s ? 'step-primary' : ''}`}>{s}</a>
          ))}
        </div>
        {renderStep()}
        <div className="mt-6 flex justify-between">
          <button type="button" className="btn" disabled={step === 1} onClick={() => setStep((s) => Math.max(1, s - 1))}>Back</button>
          {step < 5 ? (
            <button type="button" className="btn btn-primary" disabled={!canGoNext} onClick={() => setStep((s) => Math.min(5, s + 1))}>Next</button>
          ) : null}
        </div>
      </div>
      
      {/* Privacy Help Modal */}
      <PrivacyAccessModal
        isOpen={showPrivacyHelp}
        onClose={() => setShowPrivacyHelp(false)}
        onAccept={() => setShowPrivacyHelp(false)}
        userRole="student"
      />
    </div>
  );
}

export default SubmitComplaint;


