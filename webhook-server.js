const express = require('express');
const crypto = require('crypto');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware to parse JSON
app.use(express.json());

// Load webhook secret from environment
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-webhook-secret-here';

// Verify GitHub webhook signature
function verifySignature(payload, signature) {
    const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
    const digest = 'sha256=' + hmac.update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

// Log function
function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - WEBHOOK: ${message}\n`;
    console.log(logMessage.trim());
    fs.appendFileSync('/home/scriptblox-bot/update.log', logMessage);
}

// Webhook endpoint
app.post('/webhook', (req, res) => {
    const signature = req.headers['x-hub-signature-256'];
    const payload = JSON.stringify(req.body);

    if (!signature) {
        log('ERROR: No signature provided');
        return res.status(400).send('No signature');
    }

    if (!verifySignature(payload, signature)) {
        log('ERROR: Invalid signature');
        return res.status(401).send('Invalid signature');
    }

    const { ref, repository } = req.body;

    // Only process pushes to main branch
    if (ref === 'refs/heads/main' && repository.name === 'Bypasser-Bot') {
        log(`Received push to main branch from ${repository.full_name}`);
        
        // Execute update script
        exec('cd /home/scriptblox-bot && ./auto-update.sh', (error, stdout, stderr) => {
            if (error) {
                log(`ERROR: Update script failed - ${error.message}`);
                return;
            }
            
            if (stderr) {
                log(`Update warnings: ${stderr}`);
            }
            
            log('Update script completed successfully');
            log(`Output: ${stdout}`);
        });

        res.status(200).send('Webhook received and processed');
    } else {
        log(`Ignoring webhook for ref: ${ref}`);
        res.status(200).send('Webhook ignored');
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    log(`Webhook server started on port ${PORT}`);
    console.log(`🔗 Webhook server listening on http://0.0.0.0:${PORT}`);
    console.log(`📋 Health check: http://YOUR_SERVER_IP:${PORT}/health`);
    console.log(`📨 Webhook URL: http://YOUR_SERVER_IP:${PORT}/webhook`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    log('Webhook server shutting down...');
    process.exit(0);
});

process.on('SIGINT', () => {
    log('Webhook server shutting down...');
    process.exit(0);
});
