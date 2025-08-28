const generateOTPEmailHTML = (otp, userEmail) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your email - Take All Notes</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #ffffff;
            color: #37352f;
            line-height: 1.5;
            font-size: 16px;
        }
        
        .email-container {
            max-width: 480px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .logo-section {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .logo {
            font-size: 32px;
            font-weight: 700;
            color: #37352f;
            text-decoration: none;
            letter-spacing: -0.02em;
            display: inline-flex;
            align-items: center;
            gap: 12px;
        }
        
        .app-icon {
            width: 32px;
            height: 32px;
            object-fit: contain;
        }
        
        .content {
            margin-bottom: 40px;
        }
        
        .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #37352f;
            margin-bottom: 24px;
            line-height: 1.2;
        }
        
        .message {
            color: #787774;
            margin-bottom: 32px;
            line-height: 1.6;
        }
        
        .verification-section {
            background-color: #f7f6f3;
            border: 1px solid #e9e9e7;
            border-radius: 6px;
            padding: 24px;
            margin: 32px 0;
            text-align: center;
        }
        
        .verification-label {
            font-size: 14px;
            color: #787774;
            margin-bottom: 8px;
            font-weight: 500;
        }
        
        .verification-code {
            font-size: 32px;
            font-weight: 700;
            color: #37352f;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
            letter-spacing: 4px;
            margin: 8px 0;
        }
        
        .expiry-notice {
            font-size: 14px;
            color: #787774;
            margin-top: 16px;
        }
        
        .security-info {
            background-color: #fff8e1;
            border: 1px solid #ffe066;
            border-radius: 6px;
            padding: 16px;
            margin: 32px 0;
        }
        
        .security-info p {
            font-size: 14px;
            color: #b7860d;
            margin: 0;
        }
        
        .help-section {
            margin: 40px 0;
            padding: 24px 0;
            border-top: 1px solid #e9e9e7;
        }
        
        .help-text {
            font-size: 14px;
            color: #787774;
            margin-bottom: 12px;
        }
        
        .support-link {
            color: #0f62fe;
            text-decoration: none;
            font-weight: 500;
        }
        
        .support-link:hover {
            text-decoration: underline;
        }
        
        .footer {
            border-top: 1px solid #e9e9e7;
            padding-top: 24px;
            text-align: center;
        }
        
        .footer-text {
            font-size: 12px;
            color: #9b9a97;
            line-height: 1.4;
        }
        
        .footer-link {
            color: #9b9a97;
            text-decoration: none;
        }
        
        .footer-link:hover {
            text-decoration: underline;
        }
        
        .unsubscribe {
            margin-top: 12px;
        }
        
        @media (max-width: 480px) {
            .email-container {
                padding: 20px 16px;
            }
            
            .greeting {
                font-size: 20px;
            }
            
            .verification-code {
                font-size: 24px;
                letter-spacing: 2px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Logo Section -->
        <div class="logo-section">
            <a href="#" class="logo">
                <!-- <img src="http://localhost:5001/public/app-icon.png" alt="Take All Notes" class="app-icon"> -->
                Take All Notes
            </a>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <h1 class="greeting">Verify your email address</h1>
            
            <p class="message">
                Thanks for starting the new Take All Notes account creation process. We want to make sure it's really you. Please enter the following verification code when prompted. If you don't want to create an account, you can ignore this message.
            </p>
            
            <div class="verification-section">
                <div class="verification-label">Verification code</div>
                <div class="verification-code">${otp}</div>
                <div class="expiry-notice">(This code is valid for 10 minutes)</div>
            </div>
            
            <div class="security-info">
                <p><strong>Security tip:</strong> Take All Notes will never ask you to share or verify this code over the phone or via text message.</p>
            </div>
        </div>
        
        <!-- Help Section -->
        <div class="help-section">
            <p class="help-text">
                Didn't request this email? No problem! Your email address may have been entered by mistake. If you ignore this message, no account will be created.
            </p>
            <p class="help-text">
                Need help? <a href="#" class="support-link">Contact our support team</a>
            </p>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p class="footer-text">
                This message was produced and distributed by Take All Notes.<br>
                <a href="#" class="footer-link">Privacy Policy</a> • <a href="#" class="footer-link">Terms of Service</a>
            </p>
            <p class="footer-text unsubscribe">
                <a href="#" class="footer-link">Unsubscribe from these emails</a>
            </p>
        </div>
    </div>
</body>
</html>`;
};

module.exports = { generateOTPEmailHTML };
