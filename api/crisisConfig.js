/**
 * CRISIS DETECTION HEURISTIC CONFIGURATION
 * 
 * IMPORTANT NOTE ON LIMITATIONS:
 * This heuristic is a crude, keyword-based scan. It will produce both false positives
 * (e.g., "I killed that exam") and false negatives (subtle expressions of distress).
 * It is NOT a clinical risk assessment tool.
 * 
 * This approach is acceptable ONLY because the action it triggers — displaying a 
 * dismissible card with crisis helpline information — is never harmful, even if 
 * triggered unnecessarily.
 */

export const crisisResources = [
  {
    name: "988 Suicide & Crisis Lifeline",
    phone: "988",
    description: "24/7, free and confidential support for people in distress."
  },
  {
    name: "Crisis Text Line",
    phone: "741741",
    description: "Text HOME to connect with a volunteer Crisis Counselor."
  },
  {
    name: "The Trevor Project",
    phone: "866-488-7386",
    description: "Crisis intervention and suicide prevention for LGBTQ youth."
  }
];

export const crisisKeywords = [
  "suicide",
  "kill myself",
  "want to die",
  "end it all",
  "better off dead",
  "can't take it anymore",
  "no reason to live",
  "hurt myself"
];

export const getBaseSystemPrompt = (aiName = "Haven", aiTone = "empathetic") => {
  return `You are a mental health counselor named ${aiName}. Respond to the user in a ${aiTone}, validating, and concise manner. Keep it conversational.`;
};

export const crisisSystemPromptAddendum = `
CRITICAL INSTRUCTION:
The user has expressed potential thoughts of self-harm or severe distress.
You MUST follow these rules for this response:
1. Lead with extreme care, empathy, and validation.
2. Be honest that you are an AI and cannot keep them safe in an emergency.
3. Explicitly point them to the crisis helplines provided on the screen.
4. Ask a direct but gentle question about whether they are safe right now (e.g., "Are you safe right now?").
5. DO NOT attempt to problem-solve, analyze their situation, or ask for detailed reasons about why they feel this way. Focus entirely on immediate safety and support.
`;
