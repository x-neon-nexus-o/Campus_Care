import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const NotificationCenter = ({ complaints, onUpdate }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [assignmentModal, setAssignmentModal] = useState({ show: false, complaint: null });
  const [users, setUsers] = useState([]);
  const [departments] = useState([
    'IT Department', 'Maintenance', 'Security', 'Mess', 'Hostel', 
    'Library', 'Sports', 'Transport', 'Finance', 'Academic'
  ]);

  useEffect(() => {
    generateNotifications();
    fetchUsers();
  }, [complaints]);

  const generateNotifications = () => {
    const now = new Date();
    const newNotifications = [];

    complaints.forEach(complaint => {
      // SLA breach notifications
      if (complaint.dueAt && new Date(complaint.dueAt) < now && complaint.status !== 'resolved') {
        newNotifications.push({
          id: `sla-${complaint._id}`,
          type: 'sla_breach',
          title: 'SLA Breach Alert',
          message: `Complaint "${complaint.subject}" has exceeded SLA deadline`,
          complaintId: complaint._id,
          priority: 'high',
          timestamp: new Date()
        });
      }

      // Unassigned complaints
      if (!complaint.assignedTo && complaint.status === 'pending') {
        newNotifications.push({
          id: `unassigned-${complaint._id}`,
          type: 'unassigned',
          title: 'Unassigned Complaint',
          message: `Complaint "${complaint.subject}" needs assignment`,
          complaintId: complaint._id,
          priority: 'medium',
          timestamp: new Date()
        });
      }

      // High urgency complaints
      if (complaint.urgency === 'urgent' && complaint.status !== 'resolved') {
        newNotifications.push({
          id: `urgent-${complaint._id}`,
          type: 'urgent',
          title: 'Urgent Complaint',
          message: `Urgent complaint "${complaint.subject}" requires immediate attention`,
          complaintId: complaint._id,
          priority: 'high',
          timestamp: new Date()
        });
      }
    });

    setNotifications(newNotifications);
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/users');
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const assignComplaint = async (complaintId, assignment) => {
    try {
      await api.patch(`/complaints/${complaintId}`, assignment);
      onUpdate();
      setAssignmentModal({ show: false, complaint: null });
    } catch (error) {
      console.error('Error assigning complaint:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'sla_breach': return '⚠️';
      case 'unassigned': return '📋';
      case 'urgent': return '🚨';
      default: return '📢';
    }
  };

  return (
    <>
      {/* Notification Bell */}
      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="btn btn-ghost btn-circle relative"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </button>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50 max-h-96 overflow-y-auto">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Notifications ({notifications.length})</h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-gray-500 text-center">No notifications</div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setAssignmentModal({ show: true, complaint: complaints.find(c => c._id === notification.complaintId) });
                      setShowNotifications(false);
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-lg">{getTypeIcon(notification.type)}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(notification.priority)}`}>
                            {notification.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {notification.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Assignment Modal */}
      {assignmentModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Assign Complaint</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Complaint</label>
                <p className="text-sm text-gray-600">{assignmentModal.complaint?.subject}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Assign to Department</label>
                <select
                  className="select select-bordered w-full"
                  onChange={(e) => {
                    if (e.target.value) {
                      assignComplaint(assignmentModal.complaint._id, { 
                        department: e.target.value,
                        assignedTo: e.target.value 
                      });
                    }
                  }}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Assign to User</label>
                <select
                  className="select select-bordered w-full"
                  onChange={(e) => {
                    if (e.target.value) {
                      assignComplaint(assignmentModal.complaint._id, { 
                        assignedTo: e.target.value 
                      });
                    }
                  }}
                >
                  <option value="">Select User</option>
                  {users.map(user => (
                    <option key={user._id} value={user.email}>{user.email} ({user.role})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  className="btn btn-ghost"
                  onClick={() => setAssignmentModal({ show: false, complaint: null })}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationCenter;
