import { useEffect, useMemo, useRef, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
// Using a simple textarea for description to avoid React 19 + react-quill incompatibility p
import toast from 'react-hot-toast';
import PrivacyAccessModal from '../components/PrivacyAccessModal';
import { useAuth } from '../contexts/AuthContext';

const categories = ['Infrastructure', 'Faculty', 'Harassment', 'Hostel', 'Mess', 'Admin', 'Other'];
const departments = ['Computer', 'IT', 'Mechanical', 'Civil', 'Electrical', 'Admin'];
const buildings = ['Main', 'Library', 'Hostel', 'Workshop'];

function SubmitComplaint() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);

  // Redirect to login if not authenticated, or redirect admin users
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role === 'admin') {
      toast.error('Admin users cannot submit complaints');
      navigate('/admin-dashboard');
      return;
    }
  }, [isAuthenticated, user?.role, navigate]);

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
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  
  // Validation states
  const [fieldErrors, setFieldErrors] = useState({});

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    if (!phone) return true; // Optional field
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
    return phoneRegex.test(phone);
  };

  const validateStudentId = (studentId) => {
    if (!studentId) return true; // Optional field
    return studentId.length >= 3 && studentId.length <= 20;
  };

  const validateName = (name) => {
    if (!name) return true; // Optional field
    return name.length >= 2 && name.length <= 50;
  };

  const validateSubject = (subject) => {
    return subject && subject.trim().length >= 3 && subject.trim().length <= 200;
  };

  const validateDescription = (description) => {
    if (!description) return false;
    const wordCount = description.trim().split(/\s+/).length;
    return wordCount >= 50 && wordCount <= 1000;
  };

  const validateTags = (tags) => {
    if (!tags) return true; // Optional field
    const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
    return tagArray.length <= 10 && tagArray.every(tag => tag.length <= 30);
  };

  // Voice recording
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [recording, setRecording] = useState(false);

  // Secret keyboard shortcut for anonymous mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Ctrl + Shift + A (case insensitive)
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        setIsAnonymous(prev => {
          const newValue = true;
          console.log('Anonymous mode activated:', newValue);
          toast.success('Anonymous mode activated', { 
            duration: 3000,
            position: 'bottom-center',
            style: { background: '#333', color: '#fff' }
          });
          return newValue;
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    console.log('Keyboard shortcut listener added. Press Ctrl+Shift+A to activate anonymous mode.');
    
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      if (!isAnonymous) {
        const emailValid = validateEmail(email);
        const nameValid = validateName(name);
        const phoneValid = validatePhone(phone);
        const studentIdValid = validateStudentId(studentId);
        return emailValid && nameValid && phoneValid && studentIdValid;
      }
      return true; // anonymous allowed
    }
    if (step === 2) {
      const subjectValid = validateSubject(subject);
      const descriptionValid = validateDescription(description);
      const tagsValid = validateTags(tags);
      return subjectValid && descriptionValid && tagsValid && category;
    }
    if (step === 3) {
      return true; // optional
    }
    if (step === 4) {
      return true; // optional
    }
    return true;
  }, [step, isAnonymous, email, name, phone, studentId, subject, description, tags, category]);

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
    if (!subject.trim() || subject.trim().length < 3) {
      toast.error('Subject is required (min 3 characters).');
      return;
    }
    if (wordCount < 50) {
      toast.error('Please provide at least 50 words in the description.');
      return;
    }
    if (!privacyAgreed) {
      toast.error('Please agree to the privacy policy to continue.');
      return;
    }
    if (!isAnonymous) {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast.error('Please enter a valid email address.');
        return;
      }
    }
    // Validate files (size/type) on client for faster feedback
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    for (const f of mediaFiles) {
      const okType = /^(image\/(jpeg|png|gif|webp|bmp|svg\+xml)|application\/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document))$/.test(f.type || '');
      if (!okType) {
        toast.error(`Unsupported file: ${f.name}`);
        return;
      }
      if (f.size > maxFileSize) {
        toast.error(`File too large (max 10MB): ${f.name}`);
        return;
      }
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
        toast.success(`Your complaint was submitted successfully. Reference ID: ${res.data.id}`);
      } else {
        toast.success('Your complaint was submitted successfully.');
      }
      
      // Reset form
      setStep(1);
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
      setPrivacyAgreed(false);

      // Redirect to track complaints page after successful submission
      setTimeout(() => {
        navigate('/track-complaints');
      }, 2000); // Wait 2 seconds to show success message
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
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
            <label className="justify-start gap-3 cursor-pointer label">
              <input type="checkbox" className="toggle toggle-primary" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
              <span className="label-text">Submit anonymously</span>
            </label>
          </div>
          {!isAnonymous && (
            <>
              <div>
                <input 
                  className={`w-full input input-bordered ${
                    name && !validateName(name) ? 'input-error' : ''
                  }`}
                  placeholder="Name (optional)" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
                {name && !validateName(name) && (
                  <span className="text-sm text-error">Name must be 2-50 characters long</span>
                )}
              </div>
              
              <div>
                <input 
                  className={`w-full input input-bordered ${
                    email && !validateEmail(email) ? 'input-error' : ''
                  }`}
                  placeholder="Email *" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                />
                {email && !validateEmail(email) && (
                  <span className="text-sm text-error">Please enter a valid email address</span>
                )}
                {!email && (
                  <span className="text-sm text-gray-500">Email is required for non-anonymous complaints</span>
                )}
              </div>
              
              <div>
                <input 
                  className={`w-full input input-bordered ${
                    phone && !validatePhone(phone) ? 'input-error' : ''
                  }`}
                  placeholder="Phone (optional)" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                />
                {phone && !validatePhone(phone) && (
                  <span className="text-sm text-error">Please enter a valid phone number</span>
                )}
              </div>
              
              <div>
                <input 
                  className={`w-full input input-bordered ${
                    studentId && !validateStudentId(studentId) ? 'input-error' : ''
                  }`}
                  placeholder="Student ID (optional)" 
                  value={studentId} 
                  onChange={(e) => setStudentId(e.target.value)} 
                />
                {studentId && !validateStudentId(studentId) && (
                  <span className="text-sm text-error">Student ID must be 3-20 characters long</span>
                )}
              </div>
            </>
          )}
        </div>
      );
    }
    if (step === 2) {
      return (
        <div className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Category *</span>
            </label>
            <select className="w-full select select-bordered" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="label">
              <span className="label-text">Subject *</span>
            </label>
            <input 
              className={`w-full input input-bordered ${
                subject && !validateSubject(subject) ? 'input-error' : ''
              }`}
              placeholder="Brief subject (3-200 characters)" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)} 
              maxLength={200}
            />
            {subject && !validateSubject(subject) && (
              <span className="text-sm text-error">Subject must be 3-200 characters long</span>
            )}
            <div className="text-sm text-gray-500">{subject.length}/200 characters</div>
          </div>
          
          <div>
            <label className="label">
              <span className="label-text">Detailed description (50-1000 words) *</span>
              <span className={`label-text-alt ${
                wordCount < 50 ? 'text-error' : wordCount > 1000 ? 'text-warning' : 'text-success'
              }`}>
                {wordCount} words
              </span>
            </label>
            <textarea
              className={`w-full textarea textarea-bordered min-h-40 ${
                description && !validateDescription(description) ? 'textarea-error' : ''
              }`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail... (minimum 50 words required)"
            />
            {description && !validateDescription(description) && (
              <span className="text-sm text-error">
                {wordCount < 50 ? `Need ${50 - wordCount} more words` : 'Description too long (max 1000 words)'}
              </span>
            )}
          </div>
          
          <div>
            <label className="label">
              <span className="label-text">Tags (optional)</span>
            </label>
            <input 
              className={`w-full input input-bordered ${
                tags && !validateTags(tags) ? 'input-error' : ''
              }`}
              placeholder="Tags (comma separated, max 10 tags)" 
              value={tags} 
              onChange={(e) => setTags(e.target.value)} 
            />
            {tags && !validateTags(tags) && (
              <span className="text-sm text-error">Maximum 10 tags, each up to 30 characters</span>
            )}
            {tags && (
              <div className="text-sm text-gray-500">
                {tags.split(',').map(tag => tag.trim()).filter(Boolean).length}/10 tags
              </div>
            )}
          </div>
        </div>
      );
    }
    if (step === 3) {
      const maxFileSize = 10 * 1024 * 1024; // 10MB
      const hasInvalidFiles = mediaFiles.some(f => {
        const validType = /^(image\/(jpeg|png|gif|webp|bmp|svg\+xml)|application\/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document))$/.test(f.type || '');
        return !validType || f.size > maxFileSize;
      });

      return (
        <div className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Media Files (optional)</span>
              <span className="label-text-alt">Max 5 files, 10MB each</span>
            </label>
            <input 
              ref={mediaInputRef} 
              type="file" 
              multiple 
              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
              className={`w-full file-input file-input-bordered ${hasInvalidFiles ? 'file-input-error' : ''}`}
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (files.length > 5) {
                  toast.error('Maximum 5 files allowed');
                  return;
                }
                setMediaFiles(files);
              }} 
            />
            <div className="text-sm text-gray-500 mt-1">
              Supported: Images (JPG, PNG, GIF, WebP, BMP, SVG), Documents (PDF, DOC, DOCX)
            </div>
            {mediaFiles.length > 0 && (
              <div className="mt-2">
                <div className="text-sm font-medium">Selected files ({mediaFiles.length}/5):</div>
                {mediaFiles.map((file, index) => {
                  const validType = /^(image\/(jpeg|png|gif|webp|bmp|svg\+xml)|application\/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document))$/.test(file.type || '');
                  const validSize = file.size <= maxFileSize;
                  const isValid = validType && validSize;
                  
                  return (
                    <div key={index} className={`text-sm p-2 rounded ${isValid ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                      <span className="font-medium">{file.name}</span>
                      <span className="ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      {!validType && <div className="text-xs">Invalid file type</div>}
                      {!validSize && <div className="text-xs">File too large (max 10MB)</div>}
                    </div>
                  );
                })}
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
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                  Record Voice Note
                </button>
              ) : (
                <button type="button" className="btn btn-error" onClick={stopRecording}>
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v4a1 1 0 11-2 0V7zM12 7a1 1 0 10-2 0v4a1 1 0 102 0V7z" clipRule="evenodd" />
                  </svg>
                  Stop Recording
                </button>
              )}
              {voiceBlob && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-success">Voice note recorded</span>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
    if (step === 4) {
      return (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-medium">Location Details (Optional)</h3>
            <p className="text-sm text-gray-500">Help us locate the issue more precisely</p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label">
                <span className="label-text">Building</span>
              </label>
              <select className="w-full select select-bordered" value={building} onChange={(e) => setBuilding(e.target.value)}>
                <option value="">Select Building</option>
                {buildings.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="label">
                <span className="label-text">Block/Wing</span>
              </label>
              <input 
                className="w-full input input-bordered" 
                placeholder="e.g., A Block, North Wing" 
                value={block} 
                onChange={(e) => setBlock(e.target.value)} 
                maxLength={50}
              />
            </div>
            
            <div>
              <label className="label">
                <span className="label-text">Room/Location</span>
              </label>
              <input 
                className="w-full input input-bordered" 
                placeholder="e.g., Room 101, Cafeteria" 
                value={room} 
                onChange={(e) => setRoom(e.target.value)} 
                maxLength={50}
              />
            </div>
            
            <div>
              <label className="label">
                <span className="label-text">Department</span>
              </label>
              <select className="w-full select select-bordered" value={department} onChange={(e) => setDepartment(e.target.value)}>
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
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
            <div className="prose whitespace-pre-wrap max-w-none">{description}</div>
            <p><strong>Tags:</strong> {tags}</p>
            <p><strong>Media:</strong> {mediaFiles.length} file(s)</p>
            <p><strong>Voice:</strong> {voiceBlob ? 'Yes' : 'No'}</p>
            <p><strong>Location:</strong> {[building, block, room].filter(Boolean).join(' / ')} {department && ` | Dept: ${department}`}</p>
            <div className="form-control">
              <label className="justify-start gap-3 cursor-pointer label">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-primary" 
                  id="agree" 
                  checked={privacyAgreed}
                  onChange={(e) => setPrivacyAgreed(e.target.checked)}
                />
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
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-3xl p-6 rounded-md shadow bg-base-100">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Submit a Complaint</h1>
          <button className="btn btn-ghost" onClick={()=>navigate('/track-complaints')}>Back to Tracker</button>
        </div>
        <div className="w-full mb-6 steps">
          {[1,2,3,4,5].map((s) => (
            <a key={s} className={`step ${step >= s ? 'step-primary' : ''}`}>{s}</a>
          ))}
        </div>
        {renderStep()}
        <div className="flex justify-between mt-6">
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


