const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authroutes');
const complaintRoutes = require('./routes/complaintroutes');
const path = require('path');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Limit body size

// Security Headers
const helmet = require('helmet');
app.use(helmet());

// Rate Limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Sanitization against NoSQL Injection & XSS
const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean'); // Deprecated, but we can stick to simple sanitization or rely on React escaping
// Note: React automatically escapes content, so xss-clean is less critical on backend but good for hygiene
// app.use(mongoSanitize());
// app.use(xss());

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health and readiness endpoints
const mongoose = require('mongoose');
const { version } = require('./package.json');

app.get('/api/health', (req, res) => {
    const state = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
    const statusMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    const dbConnected = state === 1;
    res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version,
        db: {
            connected: dbConnected,
            state: statusMap[state] ?? String(state)
        }
    });
});

app.get('/api/ready', (req, res) => {
    const isReady = mongoose.connection.readyState === 1;
    if (isReady) {
        return res.status(200).json({ status: 'ready' });
    }
    return res.status(503).json({ status: 'not-ready' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("Server running on http://localhost:5000/");
});