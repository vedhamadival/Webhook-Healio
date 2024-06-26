const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// MongoDB Schema and Model
const webhookSchema = new mongoose.Schema({
  event: String,
  payload: Object,
  receivedAt: { type: Date, default: Date.now }
});

const Webhook = mongoose.model('Webhook', webhookSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Endpoint to receive webhooks
app.post('/webhook', async (req, res) => {
  try {
    const { triggerEvent, payload } = req.body;

    // Save the webhook data to the database
    const webhook = new Webhook({ event: triggerEvent, payload });
    await webhook.save();

    res.status(200).send('Webhook received successfully');
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
