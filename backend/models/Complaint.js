const mongoose = require('mongoose');
const crypto = require('crypto');

const complaintSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isAnonymous: { type: Boolean, default: false },

    // Encrypted anonymous tracking (for system use only)
    anonymousId: {
      type: String,
      unique: true,
      sparse: true // Allows null values
    },

    // Personal details (optional if anonymous)
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    studentId: { type: String },

    // Complaint Details
    category: {
      type: String,
      enum: ['Infrastructure', 'Faculty', 'Harassment', 'Hostel', 'Mess', 'Admin', 'Other'],
      required: true,
    },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],

    // Media
    mediaFiles: [{ type: String }], // URLs/paths
    voiceNote: { type: String },

    // Location/Context
    building: { type: String },
    block: { type: String },
    room: { type: String },
    department: { type: String },

    // Assignment and Management
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedDepartment: { type: String },

    // Meta
    status: {
      type: String,
      enum: ['submitted', 'in_progress', 'resolved', 'rejected', 'pending', 'in_review', 'escalated'],
      default: 'pending',
    },
    urgency: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },

    // SLA Management
    slaHours: { type: Number, default: 72 },
    dueAt: { type: Date },

    // Escalation tracking
    escalatedAt: { type: Date },
    escalatedTo: { type: String },
    escalationReason: { type: String },

    // Comments and updates
    comments: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      comment: { type: String, required: true },
      isInternal: { type: Boolean, default: false }, // Internal notes not visible to complainant
      createdAt: { type: Date, default: Date.now }
    }],

    // Privacy and security
    isEncrypted: { type: Boolean, default: false },
    encryptionKey: { type: String }, // For sensitive data encryption
  },

  { timestamps: true }
);

// Indexes for performance
complaintSchema.index({ status: 1, createdAt: -1 });
complaintSchema.index({ userId: 1, createdAt: -1 });
complaintSchema.index({ department: 1, status: 1 });
complaintSchema.index({ assignedTo: 1, status: 1 });

// Generate anonymous ID for tracking
complaintSchema.pre('save', function (next) {
  if (this.isAnonymous && !this.anonymousId) {
    // Generate a unique anonymous ID using crypto
    this.anonymousId = crypto.randomBytes(16).toString('hex');
  }

  // Set dueAt based on slaHours if not set
  if (!this.dueAt && this.slaHours) {
    const created = this.createdAt || new Date();
    this.dueAt = new Date(created.getTime() + this.slaHours * 60 * 60 * 1000);
  }

  next();
});

// Method to get display name for anonymous complaints
complaintSchema.methods.getDisplayName = function () {
  if (this.isAnonymous) {
    return 'Anonymous User';
  }
  return this.name || this.email || 'Unknown User';
};

// Method to check if user can view this complaint
complaintSchema.methods.canUserView = function (user) {
  // Admin can view all
  if (user.role === 'admin') return true;

  // User can view their own complaints
  const viewerId = user.id || user._id;
  if (this.userId && viewerId && this.userId.toString() === viewerId.toString()) return true;

  // Department head/faculty can view department complaints
  if (
    (user.role === 'head' || user.role === 'faculty') &&
    user.department &&
    (this.department === user.department || this.assignedDepartment === user.department)
  ) {
    return true;
  }

  // Assigned user can view
  if (this.assignedTo && viewerId && this.assignedTo.toString() === viewerId.toString()) return true;

  return false;
};

module.exports = mongoose.model('Complaint', complaintSchema);


