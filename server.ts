import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Google Gen AI SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Common fraud analysis schema for structured JSON output
const scamAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    riskScore: {
      type: Type.NUMBER,
      description: 'Fraud risk score from 0 (completely safe) to 100 (definite high-risk scam).',
    },
    riskLevel: {
      type: Type.STRING,
      description: 'Risk level categorized strictly as "LOW", "MEDIUM", or "HIGH".',
    },
    scamCategory: {
      type: Type.STRING,
      description: 'Primary scam category (e.g. Bank and UPI scams, OTP scams, Phishing links, Fake job offers, Lottery and prize scams, Investment scams, Impersonation scams, Delivery and parcel scams, or Safe / Legitimate).',
    },
    summary: {
      type: Type.STRING,
      description: 'A beginner-friendly, clear summary explaining why this message or content is risky or safe.',
    },
    warningSigns: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'List of specific warning signs detected (e.g., false urgency, fake authority, prize bait, OTP request).',
    },
    suspiciousWords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Key suspicious words or phrases found in the content.',
    },
    recommendedActions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Actionable steps the user should take right now to stay safe.',
    },
    extractedText: {
      type: Type.STRING,
      description: 'For image analysis, the exact text extracted from the screenshot. For text analysis, repeat or summarize the analyzed text.',
    },
  },
  required: [
    'riskScore',
    'riskLevel',
    'scamCategory',
    'summary',
    'warningSigns',
    'suspiciousWords',
    'recommendedActions',
    'extractedText',
  ],
};

const SYSTEM_INSTRUCTION = `You are ScamShield AI, an expert cybersecurity fraud analyst and digital forensics specialist. 
Your job is to analyze suspicious text messages, emails, WhatsApp chats, links, and screenshots sent by users to detect potential scams, phishing, social engineering, and financial fraud.
Analyze thoroughly and objectively. 
Categories to check: Bank and UPI scams, OTP scams, Phishing links, Fake job offers, Lottery and prize scams, Investment scams, Impersonation scams, Delivery and parcel scams, or Safe / Legitimate.
Always output valid JSON matching the requested schema. Provide beginner-friendly explanations and emphasize that your output is an AI risk assessment, not absolute legal or financial proof.`;

// API Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Analyze Text Endpoint
app.post('/api/analyze-text', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide valid text to analyze.' });
    }

    const prompt = `Analyze the following message for scam and fraud risk:\n\n"${text}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: scamAnalysisSchema,
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error('Failed to generate analysis from Gemini.');
    }

    const result = JSON.parse(jsonText.trim());
    res.json(result);
  } catch (error: any) {
    console.error('Error analyzing text:', error);
    res.status(500).json({
      error: error.message || 'Failed to analyze message due to an internal server error.',
    });
  }
});

// Analyze Image Endpoint (Screenshot Scanner)
app.post('/api/analyze-image', async (req, res) => {
  try {
    const { image, mimeType } = req.body;
    if (!image || !mimeType) {
      return res.status(400).json({ error: 'Image data and mimeType are required.' });
    }

    // Clean base64 string if data URL prefix is present
    let base64Data = image;
    if (image.includes(',')) {
      base64Data = image.split(',')[1];
    }

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Data,
      },
    };

    const textPart = {
      text: 'Examine this screenshot carefully. Extract all text visible in the image, and perform a comprehensive scam, phishing, and fraud risk analysis on the content shown.',
    };

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: scamAnalysisSchema,
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error('Failed to analyze image from Gemini.');
    }

    const result = JSON.parse(jsonText.trim());
    res.json(result);
  } catch (error: any) {
    console.error('Error analyzing image:', error);
    res.status(500).json({
      error: error.message || 'Failed to analyze screenshot due to an internal server error.',
    });
  }
});

// Setup Vite middleware in development or serve static in production
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`ScamShield AI server running on http://0.0.0.0:${PORT}`);
});
