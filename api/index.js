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
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // We could format history here if needed, but for now we'll just send the latest message
    // with a system instruction.
    const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3.6-flash',
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
    
    // Send initial metadata
    res.write(`data: ${JSON.stringify({ type: 'meta', crisisDetected: isCrisisDetected })}\n\n`);
    
    // Stream chunks
    for await (const chunk of responseStream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ type: 'text', text: chunk.text })}\n\n`);
      }
    }
    
    // End the stream
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Error generating AI response:', error);
    // If headers are not sent, send a 500 error. Otherwise just end the stream.
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to generate AI response' });
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error' })}\n\n`);
      res.end();
    }
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

export default app;
