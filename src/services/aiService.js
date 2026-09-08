/**
 * AI Service to handle conversational responses via the backend API.
 */

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3001');

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

export const generateAIResponseStream = async (userMessage, initialMood, history, aiName, aiTone, callbacks) => {
  const startTime = Date.now();
  const maxWaitTimeForError = 10000; // 10 seconds before showing error
  let errorShown = false;

  if (callbacks.onStatus) callbacks.onStatus('yellow'); // Connecting/Retrying

  while (true) {
    try {
      const controller = new AbortController();
      // If error already shown, we just use a static 10s timeout for each subsequent retry attempt
      const timeLeft = errorShown ? 10000 : Math.max(2000, maxWaitTimeForError - (Date.now() - startTime));
      const timeoutId = setTimeout(() => controller.abort(), timeLeft);

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
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // If we made it here, connection is successful!
      if (callbacks.onStatus) callbacks.onStatus('green');

      // If we previously showed the error, let UI know we recovered so it can clear the error message
      if (errorShown && callbacks.onRecovered) {
        callbacks.onRecovered();
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.substring(6);
              if (dataStr.trim() === '') continue;
              try {
                const data = JSON.parse(dataStr);
                if (data.type === 'meta' && callbacks.onMeta) {
                  callbacks.onMeta(data.crisisDetected);
                } else if (data.type === 'text' && callbacks.onChunk) {
                  callbacks.onChunk(data.text);
                } else if (data.type === 'done' && callbacks.onDone) {
                  callbacks.onDone();
                } else if (data.type === 'error' && callbacks.onError) {
                  throw new Error("Stream returned error");
                }
              } catch (e) {
                if (e.message === "Stream returned error") throw e;
                console.error("Error parsing JSON chunk:", e, dataStr);
              }
            }
          }
        }
      }
      
      // If we successfully finish the stream, exit the infinite retry loop
      return; 
    } catch (error) {
      const elapsed = Date.now() - startTime;
      
      // If 10 seconds passed and we haven't shown the error yet, show it!
      if (!errorShown && (elapsed >= maxWaitTimeForError || error.name === 'AbortError')) {
        errorShown = true;
        if (callbacks.onStatus) callbacks.onStatus('red');
        if (callbacks.onError) callbacks.onError(error);
      }
      
      // Wait 3 seconds before the next background retry attempt, or 35 seconds if rate limited
      let delay = 3000;
      if (error.message && error.message.includes('429')) {
        console.warn("Rate limited (429). Backing off for 35 seconds...");
        delay = 35000;
      }
      await new Promise(r => setTimeout(r, delay));
    }
  }
};
