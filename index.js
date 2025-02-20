require('dotenv').config();
const express = require('express');
const twilio = require('twilio');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = new twilio(accountSid, authToken);

// Webhook to receive messages from WhatsApp
app.post('/whatsapp', async (req, res) => {
    const { Body, From } = req.body;

    console.log(`Message from ${From}: ${Body}`);

    // Send a response back to the same number
    await twilioClient.messages.create({
      from: 'whatsapp:+14155238886',  // Twilio Sandbox number
      to: From,  // Just use the 'From' number, which already includes 'whatsapp:'
      body: `You said: ${Body}`,
    })
    .then(message => {
      console.log("Message sent successfully:", message.sid);
    })
    .catch(error => {
        console.error("Error sending message:", error);
        if (error.status) {
            console.log("Twilio error status:", error.status);
        }
        if (error.message) {
            console.log("Twilio error message:", error.message);
        }
    });

    
    console.log("Sending message to:", `${From}`);
    console.log("Message body:", Body);
  

    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

console.log("Twilio SID:", process.env.TWILIO_ACCOUNT_SID);
console.log("Twilio Auth Token:", process.env.TWILIO_AUTH_TOKEN);
console.log("Twilio Number:", process.env.TWILIO_PHONE_NUMBER);

