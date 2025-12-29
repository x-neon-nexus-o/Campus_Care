# 🎓 Web-Based Complaint Resolution System (CampusCare)

## 📋 Project Description

**CampusCare** is a comprehensive web-based complaint resolution system designed specifically for college and university environments. This platform streamlines the process of reporting, tracking, and resolving campus-related issues, ensuring efficient communication between students, faculty, and administration.

The system addresses the common challenges faced in traditional complaint management by providing a centralized, transparent, and user-friendly platform where students can voice their concerns and track resolution progress in real-time.

### 🎯 Project Goals
- **Streamline Communication**: Bridge the gap between students and administration
- **Ensure Transparency**: Provide real-time tracking and status updates
- **Improve Efficiency**: Automate complaint routing and escalation processes
- **Maintain Privacy**: Support anonymous complaint submission when needed
- **Data-Driven Insights**: Generate analytics for better decision-making

## ✨ Key Features

### 🔐 **Authentication & Authorization**
- **Role-Based Access Control**: Students, Faculty, Department Heads, and Administrators
- **Secure JWT Authentication**: Token-based authentication system
- **Approval-Based Registration**: Admin-controlled user registration process
- **Password Recovery**: Email-based password reset functionality

### 📝 **Complaint Management**
- **Multi-Step Complaint Submission**: Intuitive form with validation
- **Anonymous Filing**: Optional anonymous complaint submission
- **Media Support**: Upload images, documents, and voice recordings
- **Real-Time Tracking**: Live status updates and progress monitoring
- **Categorization**: Infrastructure, Faculty, Harassment, Hostel, Mess, Admin, and Other

### 👥 **User Dashboards**
- **Student Dashboard**: Submit complaints, track status, access help
- **Faculty Dashboard**: Manage department complaints, update statuses
- **Admin Panel**: Complete system oversight, analytics, and user management
- **Responsive Design**: Mobile-friendly interface for all devices

### 📊 **Analytics & Reporting**
- **Real-Time Statistics**: Complaint counts, resolution rates, response times
- **Export Capabilities**: CSV, PDF, DOCX, and image exports
- **Visual Charts**: Interactive graphs and KPI dashboards
- **SLA Tracking**: Service Level Agreement monitoring and escalation

### 🔔 **Communication Features**
- **Status Notifications**: Automated updates on complaint progress
- **Comment System**: Internal and external communication threads
- **Email Integration**: Automated notifications and alerts
- **Escalation Management**: Automatic escalation for overdue complaints

## 🛠️ Tech Stack

### **Frontend**
- **⚛️ React 18**: Modern React with hooks and functional components
- **⚡ Vite**: Fast build tool and development server
- **🎨 TailwindCSS**: Utility-first CSS framework
- **🌼 DaisyUI**: Beautiful component library for TailwindCSS
- **🔧 Preline UI**: Accessible UI components for Tailwind CSS
- **📋 React Hook Form**: Performant, flexible and extensible forms
- **✅ Zod**: TypeScript-first schema declaration and validation
- **🔥 React Hot Toast**: Smoking hot notifications for React
- **📊 Recharts**: Interactive charts and data visualization
- **🧭 React Router**: Client-side routing and navigation

### **Backend**
- **🟢 Node.js**: JavaScript runtime environment
- **🚀 Express.js**: Fast and minimalist web framework
- **🍃 MongoDB**: NoSQL database for flexible data storage
- **📦 Mongoose**: MongoDB object modeling for Node.js
- **🔐 JWT**: JSON Web Tokens for secure authentication
- **📧 Nodemailer**: Email sending capabilities
- **🛡️ Express Rate Limit**: Basic security against brute-force attacks
- **📂 Multer**: Node.js middleware for handling multipart/form-data

### **Additional Tools**
- **📄 jsPDF**: PDF generation and export
- **📊 PapaParse**: CSV parsing and generation
- **🖼️ html-to-image**: Dashboard screenshot exports
- **📝 docx**: Microsoft Word document generation
- **🔒 bcrypt**: Password hashing and security

## 🏗️ System Architecture

### **System Flow Overview**
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Student   │    │   Faculty   │    │    Admin    │
│  Dashboard  │    │  Dashboard  │    │  Dashboard  │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │
       └──────────────────┼──────────────────┘
                          │
                   ┌──────▼──────┐
                   │   React     │
                   │  Frontend   │
                   └──────┬──────┘
                          │ HTTP/REST API
                   ┌──────▼──────┐
                   │   Express   │
                   │   Backend   │
                   └──────┬──────┘
                          │
                   ┌──────▼──────┐
                   │   MongoDB   │
                   │  Database   │
                   └─────────────┘
```

### **Project Structure**
```
CampusCare/
├── 📁 backend/                 # Express.js API Server
│   ├── 📁 config/             # Database configuration
│   ├── 📁 controllers/        # Business logic controllers
│   ├── 📁 emailTemplates/     # Email HTML templates
│   ├── 📁 middleware/         # Authentication & validation
│   ├── 📁 models/             # MongoDB schemas
│   ├── 📁 routes/             # API route definitions
│   ├── 📁 uploads/            # File uploads & exports
│   ├── 📄 adminManager.js     # Admin management script
│   ├── 📄 server.js           # Main server file
│   └── 📄 package.json        # Backend dependencies
│
└── 📁 frontend/               # React.js Client Application
    ├── 📁 src/
    │   ├── 📁 assets/         # Static assets
    │   ├── 📁 components/     # Reusable UI components
    │   ├── 📁 contexts/       # React context providers
    │   ├── 📁 pages/          # Application pages/routes
    │   ├── 📁 utils/          # Utility functions
    │   ├── 📄 App.jsx         # Main application component
    │   └── 📄 main.jsx        # Entry point
    ├── 📄 index.html          # HTML template
    ├── 📄 package.json        # Frontend dependencies
    └── 📄 vite.config.js      # Vite configuration
```

## 🚀 Installation & Setup Guide

### **Prerequisites**
Before you begin, ensure you have the following installed on your system:
- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local installation or MongoDB Atlas account) - [Setup guide](https://docs.mongodb.com/manual/installation/)
- **Git** - [Download here](https://git-scm.com/)

### **Step 1: Clone the Repository**
```bash
# Clone the repository
git clone https://github.com/your-username/campus-care.git

# Navigate to the project directory
cd campus-care
```

### **Step 2: Backend Setup**
```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Create environment variables file
cp .env.example .env
```

### **Step 3: Configure Environment Variables**
Create a `.env` file in the `backend/` directory with the following configuration:

```env
# Server Configuration
PORT=5000

# Database Configuration
MONGODB_URI="mongodb://localhost:27017/campuscare"
# For MongoDB Atlas, use your connection string:
# MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/campuscare"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"

# Email Configuration (for password reset)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Optional: Admin Configuration
ADMIN_EMAIL="admin@famt.ac.in"
ADMIN_PASSWORD="admin@123"
```

### **Step 4: Frontend Setup**
```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install frontend dependencies
npm install
```

### **Step 5: Database Setup**
```bash
# Navigate to backend directory
cd backend

# Seed the database with default admin user
npm run seed:admin

# Optional: Create additional admin users
npm run admin list
```

### **Step 6: Start the Application**

**Option A: Development Mode (Recommended)**
```bash
# Terminal 1 - Start Backend Server
cd backend
npm run dev

# Terminal 2 - Start Frontend Development Server
cd frontend
npm run dev
```

**Option B: Production Mode**
```bash
# Build frontend for production
cd frontend
npm run build

# Start backend server
cd ../backend
npm start
```

### **Step 7: Access the Application**
- **Frontend**: Open your browser and navigate to `http://localhost:3002`
- **Backend API**: Available at `http://localhost:5000`
- **Admin Panel**: Login with `admin@famt.ac.in` / `admin@123`

### **🔧 Troubleshooting**
- **Port conflicts**: Change the PORT in `.env` if 5000 is already in use
- **Database connection**: Ensure MongoDB is running locally or check your Atlas connection string
- **Email issues**: Verify your email credentials and enable "Less secure app access" for Gmail

## 📖 Usage Guide

### **👨‍🎓 For Students**

1. **Registration & Login**
   ```
   • Visit the application homepage
   • Click "Register" and create account with college email (@famt.ac.in)
   • Wait for admin approval (if required)
   • Login with your credentials
   ```

2. **Submit a Complaint**
   ```
   • Click "Lodge Complaint" from dashboard
   • Fill out the multi-step form:
     - Personal details (or choose anonymous)
     - Complaint details (category, subject, description)
     - Upload media files (optional)
     - Add location details (optional)
     - Review and submit
   ```

3. **Track Complaints**
   ```
   • Access "Track Complaint" from dashboard
   • View all your submitted complaints
   • Monitor real-time status updates
   • Add comments or additional information
   ```

### **👩‍🏫 For Faculty & Department Heads**

1. **Dashboard Access**
   ```
   • Login with faculty credentials
   • Access department-specific complaints
   • View assigned complaints and priorities
   ```

2. **Manage Complaints**
   ```
   • Update complaint status (In Progress, Resolved, etc.)
   • Add internal comments and notes
   • Assign complaints to team members
   • Set priority levels and urgency
   ```

### **👨‍💼 For Administrators**

1. **System Overview**
   ```
   • Access comprehensive admin dashboard
   • View system-wide statistics and KPIs
   • Monitor complaint resolution metrics
   ```

2. **User Management**
   ```
   • Approve/reject student registrations
   • Manage faculty and staff accounts
   • Assign roles and permissions
   ```

3. **Complaint Management**
   ```
   • View all complaints across departments
   • Generate reports and analytics
   • Export data in multiple formats (CSV, PDF, DOCX)
   • Handle escalated complaints
   ```

## 🔮 Future Enhancements

### **🤖 AI-Powered Features**
- **Smart Categorization**: Automatic complaint classification using NLP
- **Sentiment Analysis**: Detect urgency and emotional tone in complaints
- **Abuse Detection**: Identify and filter inappropriate or spam complaints
- **Predictive Analytics**: Forecast complaint trends and resolution times

### **🎙️ Advanced Communication**
- **Voice-to-Text**: Convert voice recordings to text automatically
- **Multi-language Support**: Support for regional languages
- **Chatbot Integration**: AI assistant for common queries and guidance
- **SMS Notifications**: Mobile alerts for important updates

### **📊 Enhanced Analytics**
- **Machine Learning Insights**: Pattern recognition in complaint data
- **Performance Dashboards**: Advanced KPI tracking and visualization
- **Predictive Maintenance**: Proactive issue identification
- **Custom Report Builder**: User-defined report generation

### **🔗 Integration Capabilities**
- **ERP Integration**: Connect with existing college management systems
- **Mobile Application**: Native iOS and Android apps
- **API Gateway**: Third-party integrations and webhooks
- **Social Media Integration**: Monitor and respond to social media complaints

## 👥 Contributors

### **Development Team**
- **[Your Name]** - *Project Lead & Full-Stack Developer*
  - System architecture and database design
  - Backend API development and authentication
  - Frontend React components and user interface

- **[Team Member 2]** - *Frontend Developer*
  - User interface design and implementation
  - Responsive design and mobile optimization
  - User experience testing and improvements

- **[Team Member 3]** - *Backend Developer*
  - API development and database management
  - Security implementation and testing
  - Performance optimization and scalability

- **[Team Member 4]** - *UI/UX Designer*
  - User interface design and prototyping
  - User experience research and testing
  - Visual design and branding

### **Special Thanks**
- **College Administration** - For project guidance and requirements
- **Faculty Advisors** - For technical mentorship and support
- **Beta Testers** - Students and staff who provided valuable feedback

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 CampusCare Development Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Support & Contact

For technical support, bug reports, or feature requests:

- **📧 Email**: support@campuscare.edu
- **🐛 Issues**: [GitHub Issues](https://github.com/your-username/campus-care/issues)
- **📖 Documentation**: [Wiki](https://github.com/your-username/campus-care/wiki)
- **💬 Discussions**: [GitHub Discussions](https://github.com/your-username/campus-care/discussions)

---

<div align="center">

**⭐ If you found this project helpful, please give it a star! ⭐**

Made with ❤️ by the CampusCare Development Team

</div>



