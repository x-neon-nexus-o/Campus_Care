const resetPasswordTemplate = (resetLink) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - CampusCare</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #e0e0e0;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #2563eb;
            margin: 0;
        }
        .content {
            padding: 0 20px 30px;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #2563eb;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            padding: 20px 0;
            color: #666666;
            font-size: 14px;
            border-top: 1px solid #e0e0e0;
            margin-top: 30px;
        }
        .code {
            background-color: #f0f5ff;
            padding: 10px 15px;
            border-radius: 5px;
            font-family: monospace;
            word-break: break-all;
            margin: 15px 0;
        }
        .note {
            font-size: 13px;
            color: #666666;
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px dashed #e0e0e0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>CampusCare</h1>
            <p>Your Campus Grievance Redressal System</p>
        </div>
        
        <div class="content">
            <h2>Password Reset Request</h2>
            <p>Hello,</p>
            <p>We received a request to reset your CampusCare account password. Click the button below to reset it:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" class="button">Reset Password</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <div class="code">${resetLink}</div>
            
            <p class="note">
                <strong>Note:</strong> This password reset link is valid for 1 hour. If you didn't request this, you can safely ignore this email.
            </p>
        </div>
        
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} CampusCare. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
        </div>
    </div>
</body>
</html>
`;

module.exports = resetPasswordTemplate;
