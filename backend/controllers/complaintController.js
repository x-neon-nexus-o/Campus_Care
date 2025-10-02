const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Papa = require('papaparse');
const fs = require('fs');
const path = require('path');

// Create complaint
exports.createComplaint = async (req, res) => {
  try {
    const {
      isAnonymous,
      name,
      email,
      phone,
      studentId,
      category,
      subject,
      description,
      tags,
      building,
      block,
      room,
      department,
    } = req.body;

    // Basic validations
    const errors = [];
    const allowedCategories = ['Infrastructure', 'Faculty', 'Harassment', 'Hostel', 'Mess', 'Admin', 'Other'];
    if (!category || !allowedCategories.includes(category)) errors.push('Invalid category');
    if (!subject || String(subject).trim().length < 3) errors.push('Subject is required (min 3 chars)');
    if (!description || String(description).trim().split(/\s+/).length < 50) errors.push('Description must be at least 50 words');
    if (!isAnonymous && !email) errors.push('Email is required if not anonymous');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Invalid email');
    if (phone && !/^\+?[0-9\-\s]{7,15}$/.test(phone)) errors.push('Invalid phone');
    if (errors.length) {
      return res.status(400).json({ message: errors.join(', ') });
    }

    // Collect uploaded files
    const mediaFiles = (req.files?.media || []).map((f) => `/uploads/${f.filename}`);
    const voiceNote = req.files?.voice?.[0] ? `/uploads/${req.files.voice[0].filename}` : undefined;

    const complaint = await Complaint.create({
      userId: req.user?.id,
      isAnonymous: isAnonymous === 'true' || isAnonymous === true,
      name,
      email,
      phone,
      studentId,
      category,
      subject,
      description,
      tags: typeof tags === 'string' ? tags.split(',').map((t) => t.trim()).filter(Boolean) : tags,
      mediaFiles,
      voiceNote,
      building,
      block,
      room,
      department,
    });

    res.status(201).json({ id: complaint._id });
  } catch (err) {
    console.error('Create complaint error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// List complaints with role-based filtering
exports.listComplaints = async (req, res) => {
  try {
    const { id, from, to, dept, status, urgency, assigned, priority, limit } = req.query;
    const query = {};
    
    // Role-based access control
    if (req.user.role === 'admin') {
      // Admin can see all complaints
      // No additional filtering needed
    } else if (req.user.role === 'head') {
      // Department head can see all complaints in their department
      query.$or = [
        { department: req.user.department },
        { assignedDepartment: req.user.department },
        { assignedTo: req.user.id }
      ];
    } else if (req.user.role === 'faculty') {
      // Faculty can see complaints assigned to them or in their department
      query.$or = [
        { assignedTo: req.user.id },
        { department: req.user.department }
      ];
    } else {
      // Students can only see their own complaints
      query.userId = req.user.id;
    }
    
    // Additional filters
    if (id) {
      try {
        query._id = id;
      } catch (_) {}
    }
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }
    if (dept) query.department = dept;
    if (status) query.status = status;
    if (urgency) query.urgency = urgency;
    if (priority) query.priority = priority;
    if (assigned === 'true') query.assignedTo = { $exists: true, $ne: null };
    if (assigned === 'false') query.$or = [
      { assignedTo: { $exists: false } }, 
      { assignedTo: null }
    ];
    
    // Cap limit to prevent abuse; allow admins larger exports
    const maxLimit = req.user.role === 'admin' ? 10000 : 1000;
    const safeLimit = Math.min(parseInt(limit || '100', 10) || 100, maxLimit);

    const items = await Complaint.find(query)
      .populate('userId', 'email name role')
      .populate('assignedTo', 'email name role department')
      .sort({ createdAt: -1 })
      .limit(safeLimit);
    
    // Transform data to hide sensitive information for non-admin users
    const transformedItems = items.map(item => {
      const complaint = item.toObject();
      
      // Hide user details for anonymous complaints unless user is admin or owner
      if (complaint.isAnonymous && req.user.role !== 'admin' && 
          complaint.userId && complaint.userId._id.toString() !== req.user.id) {
        complaint.userId = null;
        complaint.name = 'Anonymous User';
        complaint.email = null;
        complaint.studentId = null;
        complaint.phone = null;
      }
      
      return complaint;
    });
    
    res.json(transformedItems);
  } catch (err) {
    console.error('List complaints error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// Update complaint with role-based permissions
exports.updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First, check if the complaint exists
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    // Normalize incoming fields to avoid cast errors
    // Handle assignedTo sent as email or department name
    if (Object.prototype.hasOwnProperty.call(req.body, 'assignedTo')) {
      const val = req.body.assignedTo;
      if (typeof val === 'string' && val) {
        const looksLikeObjectId = /^[a-f\d]{24}$/i.test(val);
        const looksLikeEmail = /@/.test(val);
        if (!looksLikeObjectId) {
          if (looksLikeEmail) {
            const user = await User.findOne({ email: val.trim() }).select('_id');
            if (!user) {
              return res.status(400).json({ message: 'assignedTo email not found' });
            }
            req.body.assignedTo = user._id;
          } else {
            // Treat as department string; move to assignedDepartment
            req.body.assignedDepartment = val;
            delete req.body.assignedTo;
          }
        }
      }
    }

    // Check permissions based on role
    let canUpdate = false;
    let allowedFields = [];
    
    if (req.user.role === 'admin') {
      canUpdate = true;
      allowedFields = ['status', 'assignedTo', 'urgency', 'priority', 'slaHours', 'dueAt', 'assignedDepartment', 'escalatedAt', 'escalatedTo', 'escalationReason'];
    } else if (req.user.role === 'head') {
      // Department head can update complaints in their department
      if (complaint.department === req.user.department || complaint.assignedDepartment === req.user.department) {
        canUpdate = true;
        allowedFields = ['status', 'assignedTo', 'urgency', 'priority', 'assignedDepartment', 'escalatedAt', 'escalatedTo', 'escalationReason'];
      }
    } else if (req.user.role === 'faculty') {
      // Faculty can update complaints assigned to them
      if (complaint.assignedTo && complaint.assignedTo.toString() === req.user.id) {
        canUpdate = true;
        allowedFields = ['status', 'urgency', 'priority'];
      }
    } else {
      // Students can only update their own complaints (limited fields)
      if (complaint.userId && complaint.userId.toString() === req.user.id) {
        canUpdate = true;
        allowedFields = ['description', 'tags']; // Students can only update description and tags
      }
    }
    
    if (!canUpdate) {
      return res.status(403).json({ message: 'You do not have permission to update this complaint' });
    }
    
    // Build update object with only allowed fields + validate
    const update = {};
    for (const key of allowedFields) {
      if (key in req.body) {
        update[key] = req.body[key];
      }
    }

    // Validate selected fields
    if (update.status && !['submitted','in_progress','resolved','rejected','pending','in_review','escalated'].includes(update.status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    if (update.urgency && !['low','medium','high','urgent'].includes(update.urgency)) {
      return res.status(400).json({ message: 'Invalid urgency' });
    }
    if (update.priority && !['low','medium','high','critical'].includes(update.priority)) {
      return res.status(400).json({ message: 'Invalid priority' });
    }
    if (update.slaHours && (isNaN(update.slaHours) || update.slaHours < 1 || update.slaHours > 24 * 60)) {
      return res.status(400).json({ message: 'Invalid SLA hours' });
    }
    
    // Add comment if provided
    if (req.body.comment) {
      update.$push = {
        comments: {
          userId: req.user.id,
          comment: req.body.comment,
          isInternal: req.body.isInternal || false
        }
      };
    }
    
    const doc = await Complaint.findByIdAndUpdate(id, update, { new: true })
      .populate('userId', 'email name role')
      .populate('assignedTo', 'email name role department');
    
    res.json(doc);
  } catch (err) {
    console.error('Update complaint error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// Get single complaint with role-based authorization
exports.getComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findById(id)
      .populate('userId', 'email name role')
      .populate('assignedTo', 'email name role department')
      .populate('comments.userId', 'email name role');
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    // Check if user can view this complaint using the model method
    if (!complaint.canUserView(req.user)) {
      return res.status(403).json({ message: 'You do not have permission to view this complaint' });
    }
    
    // Transform data to hide sensitive information
    const complaintObj = complaint.toObject();
    
    // Hide user details for anonymous complaints unless user is admin or owner
    if (complaintObj.isAnonymous && req.user.role !== 'admin' && 
        complaintObj.userId && complaintObj.userId._id.toString() !== req.user.id) {
      complaintObj.userId = null;
      complaintObj.name = 'Anonymous User';
      complaintObj.email = null;
      complaintObj.studentId = null;
      complaintObj.phone = null;
    }
    
    // Filter comments based on user role
    if (req.user.role !== 'admin' && req.user.role !== 'head') {
      complaintObj.comments = complaintObj.comments.filter(comment => 
        !comment.isInternal || (comment.userId && comment.userId._id && comment.userId._id.toString() === req.user.id)
      );
    }
    
    res.json(complaintObj);
  } catch (err) {
    console.error('Get complaint error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// Admin CSV export
exports.exportComplaintsCSV = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    // Reuse filters from listComplaints
    const { id, from, to, dept, status, urgency, assigned, priority, save } = req.query;
    const query = {};
    if (id) {
      try { query._id = id; } catch (_) {}
    }
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }
    if (dept) query.department = dept;
    if (status) query.status = status;
    if (urgency) query.urgency = urgency;
    if (priority) query.priority = priority;
    if (assigned === 'true') query.assignedTo = { $exists: true, $ne: null };
    if (assigned === 'false') query.$or = [ { assignedTo: { $exists: false } }, { assignedTo: null } ];

    const items = await Complaint.find(query)
      .populate('userId', 'email name role studentId phone')
      .populate('assignedTo', 'email name role department')
      .sort({ createdAt: -1 })
      .limit(10000);

    const rows = items.map(c => ({
      complaintId: c._id.toString(),
      subject: c.subject,
      category: c.category,
      department: c.department || 'Unassigned',
      status: c.status,
      urgency: c.urgency,
      priority: c.priority,
      assignedTo: c.assignedTo ? (c.assignedTo.email || c.assignedTo.name || c.assignedTo._id.toString()) : 'Unassigned',
      createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : '',
      dueAt: c.dueAt ? new Date(c.dueAt).toISOString() : '',
      slaHours: c.slaHours || 72,
      description: c.description,
      studentId: c.studentId || (c.userId && c.userId.studentId) || '',
      email: c.email || (c.userId && c.userId.email) || '',
      phone: c.phone || (c.userId && c.userId.phone) || '',
      building: c.building || '',
      room: c.room || ''
    }));

    const csv = Papa.unparse(rows);

    // If save=true, write to server filesystem and return URL
    if (save === 'true') {
      const exportsDir = path.join(__dirname, '..', 'uploads', 'exports');
      if (!fs.existsSync(exportsDir)) {
        fs.mkdirSync(exportsDir, { recursive: true });
      }
      const filename = `complaints-report-${Date.now()}.csv`;
      const filePath = path.join(exportsDir, filename);
      fs.writeFileSync(filePath, csv, 'utf8');
      const urlPath = `/uploads/exports/${filename}`;
      return res.json({ url: urlPath, filename, path: filePath });
    }

    // Otherwise, stream download directly
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="complaints-report.csv"');
    return res.status(200).send(csv);
  } catch (err) {
    console.error('Export CSV error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};
