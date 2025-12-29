<div align="center">

  <h1>🎓 CampusCare</h1>
  
  <p>
    <b>A Comprehensive Web-Based Complaint Resolution System</b>
  </p>

  <p>
    <a href="https://github.com/your-username/campus-care/graphs/contributors">
      <img src="https://img.shields.io/github/contributors/your-username/campus-care" alt="contributors" />
    </a>
    <a href="">
      <img src="https://img.shields.io/github/last-commit/your-username/campus-care" alt="last update" />
    </a>
    <a href="https://github.com/your-username/campus-care/network/members">
      <img src="https://img.shields.io/github/forks/your-username/campus-care" alt="forks" />
    </a>
    <a href="https://github.com/your-username/campus-care/stargazers">
      <img src="https://img.shields.io/github/stars/your-username/campus-care" alt="stars" />
    </a>
    <a href="https://github.com/your-username/campus-care/issues">
      <img src="https://img.shields.io/github/issues/your-username/campus-care" alt="open issues" />
    </a>
    <a href="https://github.com/your-username/campus-care/blob/master/LICENSE">
      <img src="https://img.shields.io/github/license/your-username/campus-care.svg" alt="license" />
    </a>
  </p>
   
  <h4>
    <a href="https://github.com/your-username/campus-care">View Demo</a>
    <span> · </span>
    <a href="https://github.com/your-username/campus-care/issues">Report Bug</a>
    <span> · </span>
    <a href="https://github.com/your-username/campus-care/issues">Request Feature</a>
  </h4>
</div>

<br />

<!-- Table of Contents -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#key-features">Key Features</a></li>
    <li><a href="#tech-stack">Tech Stack</a></li>
    <li><a href="#system-architecture">System Architecture</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## 📋 <a name="about-the-project"></a>About The Project

**CampusCare** removes the friction from campus complaint management. Designed for modern educational institutions, it bridges the gap between students and administration through a transparent, efficient, and user-friendly digital platform.

<div align="center">
  <!-- REPLACE WITH YOUR SCREENSHOTS -->
  <img src="https://via.placeholder.com/800x400?text=Dashboard+Screenshot" alt="Dashboard Screenshot" width="800">
</div>

### 🎯 Core Objectives
*   **Transparency**: Real-time status tracking for every complaint.
*   **Efficiency**: Automated workflows to route issues to the right department.
*   **Privacy**: Secure, optional anonymous reporting.
*   **Insight**: Data analytics to identify recurring campus issues.

---

## ✨ <a name="key-features"></a>Key Features

| Category | Features |
|:---:|:---|
| **🔐 Security** | • Role-Based Access Control (RBAC)<br>• Secure JWT Authentication<br>• Encrypted Password Recovery |
| **📝 Management** | • Multi-step Complaint Wizard<br>• Media Uploads (Images/Audio)<br>• Anonymous Filing Options |
| **📊 Dashboards** | • Student: Track & Submit<br>• Faculty: Resolve & Update<br>• Admin: Analytics & Oversight |
| **🔔 Notify** | • Real-time Status Updates<br>• Email Alerts<br>• Escalation Triggers for delays |

## 🛠️ <a name="tech-stack"></a>Tech Stack

### **Frontend**
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![DaisyUI](https://img.shields.io/badge/daisyUI-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3068B7?style=for-the-badge&logo=zod&logoColor=white)

### **Backend**
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-0073B7?style=for-the-badge&logo=nodemailer&logoColor=white)

### **Tools & Utilities**
![Git](https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![VS Code](https://img.shields.io/badge/VS_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white)

## 🏗️ <a name="system-architecture"></a>System Architecture

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

## 🚀 <a name="getting-started"></a>Getting Started

Follow these steps to set up the project locally.

### Prerequisites

*   **Node.js** (v18+ recommended)
*   **MongoDB** (Local or Atlas)
*   **npm** or **yarn**

### Installation

1.  **Clone the Repo**
    ```sh
    git clone https://github.com/your-username/campus-care.git
    cd campus-care
    ```

2.  **Backend Setup**
    ```sh
    cd backend
    npm install
    # Set up your .env file (see below)
    cp .env.example .env
    ```

3.  **Frontend Setup**
    ```sh
    cd ../frontend
    npm install
    ```

4.  **Database Seeding**
    ```sh
    cd ../backend
    npm run seed:admin
    ```

5.  **Start Development Servers**
    ```bash
    # Backend (Terminal 1)
    cd backend
    npm run dev

    # Frontend (Terminal 2)
    cd ../frontend
    npm run dev
    ```

### ⚙️ Environment Variables

Create a `.env` file in `backend/` with the following:

| Variable | Description | Default/Example |
|:--- |:--- |:--- |
| `PORT` | API Server Port | `5000` |
| `MONGODB_URI` | Database Connection String | `mongodb://localhost:27017/campuscare` |
| `JWT_SECRET` | Secret for signing tokens | `your-super-secret-key` |
| `EMAIL_USER` | Email for notifications | `mailer@campus.edu` |
| `EMAIL_PASS` | App Password for email | `xxxx-xxxx-xxxx-xxxx` |
| `ADMIN_EMAIL` | Default Admin Username | `admin@famt.ac.in` |
| `ADMIN_PASSWORD` | Default Admin Password | `admin@123` |

## 📖 <a name="usage"></a>Usage Guide

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

## 🔮 <a name="roadmap"></a>Future Enhancements

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

## 🤝 <a name="contributing"></a>Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 <a name="license"></a>License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 <a name="contact"></a>Contact

**Support**: support@campuscare.edu  
**Project Link**: [https://github.com/your-username/campus-care](https://github.com/your-username/campus-care)

<div align="center">
  <img src="https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-red" alt="Made with Love">
</div>



