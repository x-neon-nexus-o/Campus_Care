import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const PrivacyAccessModal = ({ isOpen, onClose, onAccept, userRole = 'student' }) => {
  const { user } = useAuth();
  const [showPrivacyHelp, setShowPrivacyHelp] = useState(false);

  if (!isOpen) return null;

  const getRoleInfo = (role) => {
    const roleInfo = {
      student: {
        title: "Student Access & Privacy",
        permissions: [
          "Submit complaints with optional anonymity",
          "Track only your own complaints",
          "View complaint status and updates",
          "Receive notifications about your complaints"
        ],
        privacy: "Your identity is protected when submitting anonymous complaints. Only you can see your complaint history."
      },
      faculty: {
        title: "Faculty Access & Privacy",
        permissions: [
          "View complaints assigned to your department",
          "Update complaint status and progress",
          "Add comments and notes to complaints",
          "Escalate complaints to department heads"
        ],
        privacy: "You can only access complaints within your department. Anonymous complaints show as 'Anonymous User'."
      },
      head: {
        title: "Department Head Access & Privacy",
        permissions: [
          "View all complaints in your department",
          "Assign complaints to faculty members",
          "Update complaint status and priority",
          "Escalate complaints to higher authorities",
          "Generate department reports"
        ],
        privacy: "Full access to department complaints. Anonymous complaints are processed fairly without revealing identities."
      },
      admin: {
        title: "Admin Access & Privacy",
        permissions: [
          "Full system access across all departments",
          "View, manage, and analyze all complaints",
          "Manage user accounts and roles",
          "Generate system-wide reports and analytics",
          "Configure system settings and policies"
        ],
        privacy: "Complete system oversight while maintaining user privacy. Anonymous complaints are tracked securely."
      }
    };
    return roleInfo[role] || roleInfo.student;
  };

  const roleInfo = getRoleInfo(userRole);

  return (
    <>
      {/* Main Privacy & Access Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-primary">{roleInfo.title}</h2>
            <button
              onClick={onClose}
              className="btn btn-sm btn-circle btn-ghost"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Role-based Permissions */}
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h3 className="card-title text-lg">Your Access Permissions</h3>
                <ul className="space-y-2">
                  {roleInfo.permissions.map((permission, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-sm">{permission}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Privacy Information */}
            <div className="card bg-blue-50 border border-blue-200">
              <div className="card-body">
                <h3 className="card-title text-lg text-blue-800">Privacy Protection</h3>
                <p className="text-sm text-blue-700">{roleInfo.privacy}</p>
                <button
                  onClick={() => setShowPrivacyHelp(true)}
                  className="btn btn-sm btn-outline btn-primary mt-2"
                >
                  Learn More About Privacy
                </button>
              </div>
            </div>

            {/* Security Features */}
            <div className="card bg-green-50 border border-green-200">
              <div className="card-body">
                <h3 className="card-title text-lg text-green-800">Security Features</h3>
                <ul className="space-y-1 text-sm text-green-700">
                  <li>• JWT-based authentication with role verification</li>
                  <li>• Encrypted data transmission and storage</li>
                  <li>• Session isolation - users only see their authorized data</li>
                  <li>• Anonymous complaint tracking with encrypted identity</li>
                  <li>• Audit trail for all complaint activities</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={onAccept}
                className="btn btn-primary"
              >
                I Understand & Accept
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Help Popup */}
      {showPrivacyHelp && (
        <PrivacyHelpPopup onClose={() => setShowPrivacyHelp(false)} />
      )}
    </>
  );
};

// Privacy Help Popup Component
const PrivacyHelpPopup = ({ onClose }) => {
  const steps = [
    {
      title: "Secure Storage",
      description: "Your complaint is encrypted and securely stored in our database with industry-standard security measures.",
      icon: "🔒"
    },
    {
      title: "Smart Routing",
      description: "The system automatically routes your complaint to the correct department based on the category you selected.",
      icon: "📋"
    },
    {
      title: "Status Tracking",
      description: "You can track the progress of your complaint from your personal dashboard with real-time updates.",
      icon: "📊"
    },
    {
      title: "Automatic Escalation",
      description: "If your complaint isn't resolved within the time limit, it automatically escalates to higher authorities.",
      icon: "⬆️"
    },
    {
      title: "Anonymous Protection",
      description: "If submitted anonymously, your identity remains hidden while your issue is processed fairly and promptly.",
      icon: "👤"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primary">What happens after you submit?</h2>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="card bg-base-100 shadow">
              <div className="card-body">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl">
                      {step.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="card-title text-lg">{step.title}</h3>
                    <p className="text-sm opacity-70">{step.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="badge badge-primary">{index + 1}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">Important Notes:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• All complaints are handled confidentially and professionally</li>
            <li>• You will receive email notifications for important updates</li>
            <li>• Anonymous complaints are processed with the same priority as named complaints</li>
            <li>• You can always contact support if you have questions about your complaint</li>
          </ul>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="btn btn-primary"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyAccessModal;
