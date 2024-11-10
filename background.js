
const apiKey = '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'; // Replace with your actual API key
const API_URL = "https://api.openai.com/v1/chat/completions";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateSummary') {
    generateSummaryAndExplanation(request.text)
        .then(summary => sendResponse({ success: true, summary }))
        .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keeps the message channel open for async response
}
    
    if (request.message === "selectedText") {
        generateSpeechFromText(request.text, sender.tab.id);
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'generateSummary') {
        generateSummaryAndExplanation(request.text)
            .then(summary => {
                sendResponse({ success: true, summary: summary });
            })
            .catch(error => {
                sendResponse({ success: false, error: error.message });
            });
        return true; // Ensures the message channel stays open
    }
    
    if (request.message === "selectedText") {
        generateSpeechFromText(request.text, sender.tab.id);
        return true; // For async handling in generateSpeechFromText
    }
});

  
  async function generateSummaryAndExplanation(text) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ 
                    role: "user", 
                    content: `Please summarize the following text concisely: ${text}` 
                }],
                max_tokens: 150,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid API response format');
        }

        return data.choices[0].message.content;
    } catch (error) {
        console.error('Summary generation error:', error);
        throw new Error('Failed to generate summary. Please try again.');
    }
}

async function generateSpeechFromText(text, tabId) {
  try {
      const response = await fetch("https://api.openai.com/v1/audio/speech", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
              model: "tts-1",
              voice: "alloy",
              input: text
          })
      });

      if (!response.ok) throw new Error("Failed to generate speech");

      const audioBlob = await response.blob();
      const base64Audio = await blobToBase64(audioBlob);
      
      chrome.tabs.sendMessage(tabId, { audioData: base64Audio });
  } catch (error) {
      console.error("Error generating speech:", error);
  }
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
          const base64Data = reader.result.split(',')[1];
          resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
  });
}