const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(bodyParser.json());
// Enable CORS for all routes
app.use(cors());

app.post('/sendMessage', async (req, res) => {
    const { chat_id, text } = req.body;

    // Validate incoming request data
    if (!chat_id || !text) {
        return res.status(400).json({ error: 'chat_id and text are required' });
    }

    const telegramUrl = `https://api.telegram.org/bot7441962027:AAFvYyCiygOVaT8yWtcToYNZd--bT9QRzxI/sendMessage`;

    try {
        // Send message to Telegram API
        const response = await axios.post(telegramUrl, {
            chat_id: chat_id,
            text: text,
            parse_mode: 'HTML', // Optional: Use 'HTML' or 'Markdown' for formatted messages
        });

        // Respond back to the client with success
        res.json({
            success: true,
            message: 'Message sent successfully',
            response: response.data
        });

    } catch (error) {
        // Handle error and send back failure message
        console.error('Error sending message to Telegram:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: error.response?.data || 'Failed to send message'
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
