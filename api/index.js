const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Middleware to parse incoming requests
app.use(bodyParser.json());

// Enable CORS with specific options
app.use(cors({
    origin: '*', // You can replace '*' with your frontend URL to allow only specific origins
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
}));

// Handle CORS preflight requests explicitly (especially for complex requests like POST)
app.options('/api/sendMessage', cors(), (req, res) => {
    res.status(204).end(); // Respond with no content for preflight requests
});

// POST endpoint to send Telegram messages
app.post('/api/sendMessage', async (req, res) => {
    const { chat_id, text } = req.body;

    // Validate incoming request data
    if (!chat_id || !text) {
        return res.status(400).json({ error: 'chat_id and text are required' });
    }

    // Telegram bot token and API URL
    const telegramUrl = `https://api.telegram.org/bot7441962027:AAFvYyCiygOVaT8yWtcToYNZd--bT9QRzxI/sendMessage`;

    try {
        // Send message to Telegram API
        const response = await axios.post(telegramUrl, {
            chat_id,
            text,
            parse_mode: 'HTML'
        });

        // Respond with success if message sent
        return res.json({
            success: true,
            message: 'Message sent successfully',
            response: response.data
        });

    } catch (error) {
        // Log the error for debugging and return a detailed error message
        console.error('Error sending message to Telegram:', error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            error: error.response?.data || 'Failed to send message'
        });
    }
});

// Start the server on a specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
