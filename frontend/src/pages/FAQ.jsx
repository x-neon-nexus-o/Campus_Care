import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const FAQ = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeAccordion, setActiveAccordion] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I submit a complaint?",
      answer: "Click on 'Submit Complaint' in the navigation menu, fill out the required information including category, subject, and detailed description. You can choose to submit anonymously or with your details."
    },
    {
      id: 2,
      question: "Can I submit complaints anonymously?",
      answer: "Yes, you can submit complaints anonymously. Your identity will be protected while still allowing the system to track and process your complaint effectively."
    },
    {
      id: 3,
      question: "How do I track my complaint status?",
      answer: "After logging in, go to 'Track Complaints' to see all your submitted complaints and their current status. You'll receive real-time updates on progress."
    },
    {
      id: 4,
      question: "What types of complaints can I submit?",
      answer: "You can submit complaints related to Infrastructure, Faculty issues, Harassment, Hostel problems, Mess issues, Administrative matters, or Other concerns."
    },
    {
      id: 5,
      question: "How long does it take to resolve a complaint?",
      answer: "Most complaints are resolved within 72 hours (SLA). Complex issues may take longer, and you'll be notified of any delays. Urgent complaints are prioritized."
    },
    {
      id: 6,
      question: "What if my complaint is not resolved on time?",
      answer: "If your complaint exceeds the SLA deadline, it automatically escalates to higher authorities. You'll be notified of the escalation and new timeline."
    },
    {
      id: 7,
      question: "Can I add additional information to my complaint?",
      answer: "Yes, you can update your complaint description and add comments. However, core details like category and subject cannot be changed after submission."
    },
    {
      id: 8,
      question: "Is my personal information secure?",
      answer: "Absolutely. We use industry-standard encryption and security measures. Anonymous complaints hide your identity from everyone except system administrators for accountability purposes."
    },
    {
      id: 9,
      question: "What should I do if I forget my password?",
      answer: "Click on 'Forgot Password' on the login page, enter your email, and follow the reset link sent to your registered email address."
    },
    {
      id: 10,
      question: "Can I submit multiple complaints?",
      answer: "Yes, you can submit multiple complaints. Each complaint is tracked separately with its own reference ID and status."
    }
  ];

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">FAQ & Help Center</h1>
          <p className="text-lg text-base-content/70">
            Find answers to common questions about our complaint resolution system
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            to="/submit-complaint"
            className="card bg-primary text-primary-content shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="card-body text-center">
              <h3 className="card-title justify-center">📝 Submit Complaint</h3>
              <p>File a new complaint</p>
            </div>
          </Link>
          
          <Link
            to="/track-complaints"
            className="card bg-secondary text-secondary-content shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="card-body text-center">
              <h3 className="card-title justify-center">📊 Track Status</h3>
              <p>Monitor your complaints</p>
            </div>
          </Link>
          
          <Link
            to="/login"
            className="card bg-accent text-accent-content shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="card-body text-center">
              <h3 className="card-title justify-center">🔐 Login</h3>
              <p>Access your account</p>
            </div>
          </Link>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="collapse collapse-arrow bg-base-200">
              <input
                type="radio"
                name="faq-accordion"
                checked={activeAccordion === faq.id}
                onChange={() => toggleAccordion(faq.id)}
              />
              <div className="collapse-title text-xl font-medium">
                {faq.question}
              </div>
              <div className="collapse-content">
                <p className="text-base-content/80">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="mt-12 card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Need More Help?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">📧 Email Support</h3>
                <p className="text-base-content/70">
                  For technical issues or account problems, contact us at:
                </p>
                <a 
                  href="mailto:support@famt.ac.in" 
                  className="link link-primary"
                >
                  support@famt.ac.in
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">🏢 Office Hours</h3>
                <p className="text-base-content/70">
                  Monday - Friday: 9:00 AM - 5:00 PM<br/>
                  Saturday: 9:00 AM - 1:00 PM<br/>
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="mt-8 card bg-info text-info-content shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">System Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>Version:</strong> 1.0.0
              </div>
              <div>
                <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
              </div>
              <div>
                <strong>Status:</strong> <span className="badge badge-success">Operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link to="/" className="btn btn-primary">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
