import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import { crisisResources, crisisKeywords, getBaseSystemPrompt, crisisSystemPromptAddendum } from './crisisConfig.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize the Google Gen AI client
const ai = new GoogleGenAI();

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: frontendUrl
}));
app.use(express.json());

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running successfully.' });
});

// Endpoint to serve crisis resources dynamically
app.get('/api/crisis-resources', (req, res) => {
  res.json(crisisResources);
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, aiName, aiTone } = req.body;
    
    // Crude keyword scan for crisis heuristic
    const lowercaseMessage = message.toLowerCase();
    const isCrisisDetected = crisisKeywords.some(keyword => lowercaseMessage.includes(keyword));

    // Construct the system instruction based on the heuristic
    let systemInstruction = getBaseSystemPrompt(aiName, aiTone);
    if (isCrisisDetected) {
      systemInstruction += `\n\n${crisisSystemPromptAddendum}`;
    }
    
    // We could format history here if needed, but for now we'll just send the latest message
    // with a system instruction.
    const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: [
            {
                role: 'user',
                parts: [
                    {
                        text: `${systemInstruction}\n\nUser: ${message}`
                    }
                ]
            }
        ]
    });
    
    // The frontend expects { text, options } plus now crisisDetected
    res.json({
        text: response.text,
        options: [],
        crisisDetected: isCrisisDetected
    });
  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

export default app;
