/**
 * AI Service to handle conversational responses via the backend API.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const fetchCrisisResources = async () => {
  try {
    const response = await fetch(`${API_URL}/api/crisis-resources`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching crisis resources:", error);
    return [];
  }
};

export const generateAIResponse = async (userMessage, initialMood, history, aiName, aiTone) => {
  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        initialMood,
        history,
        aiName,
        aiTone
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error calling AI service:", error);
    // Fallback response in case of an error
    return {
      text: "I'm having a little trouble connecting right now, but I'm here for you. Could you try sharing that again?",
      options: ["Retry", "Wait a moment"],
      crisisDetected: false
    };
  }
};
