/**
 * Mock AI Service to simulate conversational responses.
 * In a real scenario, this would call an API like OpenAI, Gemini, etc.
 */

const mockResponses = [
  { text: "I hear what you're saying. That sounds challenging. Can you tell me more about how that made you feel?", options: ["I felt overwhelmed", "I felt angry", "I felt sad", "Not sure yet"] },
  { text: "It's completely normal to feel that way. Many people go through similar experiences. How are you coping right now?", options: ["Talking to friends", "Just resting", "Trying to distract myself"] },
  { text: "Take a deep breath. Let's unpack that a little bit. What do you think is the root cause?", options: ["Work or school stress", "Relationships", "Health issues", "Something else"] },
  { text: "Thank you for sharing that with me. It takes courage to open up. What would be the most helpful thing for us to focus on today?", options: ["Finding solutions", "Just listening", "Learning coping skills"] },
  { text: "I'm here for you. We can take this one step at a time. What's one small thing you can do for yourself today?", options: ["Take a walk", "Listen to music", "Drink some water"] },
  { text: "How long have you been feeling this way?", options: ["Just today", "A few days", "Weeks", "A long time"] },
  { text: "It sounds like you have a lot on your plate right now. Be gentle with yourself. Have you taken any breaks today?", options: ["Yes, a short one", "Not yet", "I don't have time"] },
  { text: "Let's focus on what we can control in this situation. What is one thing in your control right now?", options: ["My reaction", "My environment", "Taking a deep breath"] },
];

export const generateAIResponse = async (userMessage, initialMood, history) => {
  // Simulate network delay to make it feel natural
  const delay = Math.random() * 1500 + 1000; // 1 to 2.5 seconds
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Pick a random empathetic response that includes interactive options
      const randomIndex = Math.floor(Math.random() * mockResponses.length);
      resolve(mockResponses[randomIndex]);
    }, delay);
  });
};
