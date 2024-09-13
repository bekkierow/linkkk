const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const serverless = require('serverless-http'); // For serverless compatibility

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// POST endpoint to send Telegram messages
app.post('/sendMessage', async (req, res) => {
    const { chat_id, text } = req.body;

    // Validate incoming request data
    if (!chat_id || !text) {
        return res.status(400).json({ error: 'chat_id and text are required' });
    }

    // Hardcoded bot token
    const telegramUrl = `https://api.telegram.org/bot7441962027:AAFvYyCiygOVaT8yWtcToYNZd--bT9QRzxI/sendMessage`;

    try {
        // Send message to Telegram API
        const response = await axios.post(telegramUrl, {
            chat_id,
            text,
            parse_mode: 'HTML'
        });

        // Respond with success
        res.json({
            success: true,
            message: 'Message sent successfully',
            response: response.data
        });

    } catch (error) {
        // Log and respond with error
        console.error('Error sending message to Telegram:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: error.response?.data || 'Failed to send message'
        });
    }
});

// Export the app as serverless function handler
module.exports = serverless(app);
