// Simple email server for contact form
const http = require('http');
const url = require('url');
const querystring = require('querystring');

// Email sending function using Replit Mail
async function sendEmail(emailData) {
    try {
        const authToken = process.env.REPL_IDENTITY 
            ? "repl " + process.env.REPL_IDENTITY
            : process.env.WEB_REPL_RENEWAL
            ? "depl " + process.env.WEB_REPL_RENEWAL
            : null;

        if (!authToken) {
            throw new Error('No authentication token found');
        }

        const emailContent = `
New Contact Form Submission from Portfolio Website

Name: ${emailData.name}
Email: ${emailData.email}
Subject: ${emailData.subject}

Message:
${emailData.message}

Submitted on: ${new Date().toLocaleString('bn-BD', {
    timeZone: 'Asia/Dhaka',
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
})}

Reply to: ${emailData.email}
        `.trim();

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2C3E50; border-bottom: 3px solid #3498DB; padding-bottom: 10px;">
                    New Contact Form Submission
                </h2>
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Name:</strong> ${emailData.name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${emailData.email}">${emailData.email}</a></p>
                    <p><strong>Subject:</strong> ${emailData.subject}</p>
                </div>
                <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #3498DB; margin: 20px 0;">
                    <h3 style="color: #2C3E50;">Message:</h3>
                    <p style="line-height: 1.6;">${emailData.message.replace(/\n/g, '<br>')}</p>
                </div>
                <div style="background-color: #e8f6f3; padding: 15px; border-radius: 5px; margin-top: 20px;">
                    <p style="margin: 0; font-size: 14px; color: #666;">
                        <strong>Reply to:</strong> <a href="mailto:${emailData.email}">${emailData.email}</a>
                    </p>
                </div>
            </div>
        `;

        const response = await fetch('https://connectors.replit.com/api/v2/mailer/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X_REPLIT_TOKEN': authToken
            },
            body: JSON.stringify({
                to: 'mehediha106@gmail.com',
                subject: `Portfolio Contact: ${emailData.subject}`,
                text: emailContent,
                html: htmlContent
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to send email');
        }

        return await response.json();
    } catch (error) {
        console.error('Email sending error:', error);
        throw error;
    }
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method === 'POST' && parsedUrl.pathname === '/send-email') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', async () => {
            try {
                const emailData = JSON.parse(body);
                
                // Validate required fields
                if (!emailData.name || !emailData.email || !emailData.subject || !emailData.message) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        success: false, 
                        message: 'All fields are required' 
                    }));
                    return;
                }
                
                // Send email
                await sendEmail(emailData);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: true, 
                    message: 'আপনার বার্তা সফলভাবে পাঠানো হয়েছে! MD Mehedi Hasan শীঘ্রই আপনার সাথে যোগাযোগ করবেন।'
                }));
                
            } catch (error) {
                console.error('Server error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: 'দুঃখিত, বার্তা পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে সরাসরি mehediha105@gmail.com এ ইমেইল করুন।'
                }));
            }
        });
    } else if (req.method === 'GET' && parsedUrl.pathname === '/') {
        // Serve the main HTML file
        const fs = require('fs');
        try {
            const html = fs.readFileSync('index.html', 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        } catch (error) {
            res.writeHead(404);
            res.end('File not found');
        }
    } else if (req.method === 'GET') {
        // Serve static files
        const fs = require('fs');
        const path = require('path');
        const filePath = parsedUrl.pathname.slice(1); // Remove leading slash
        
        try {
            const file = fs.readFileSync(filePath);
            const ext = path.extname(filePath);
            
            let contentType = 'text/plain';
            if (ext === '.html') contentType = 'text/html';
            else if (ext === '.css') contentType = 'text/css';
            else if (ext === '.js') contentType = 'application/javascript';
            else if (ext === '.ico') contentType = 'image/x-icon';
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(file);
        } catch (error) {
            res.writeHead(404);
            res.end('File not found');
        }
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server running on port ${PORT}`);
    console.log(`Email service ready for mehediha106@gmail.com`);
});