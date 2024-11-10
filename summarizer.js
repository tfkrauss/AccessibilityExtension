const apiKey = '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';  
const API_URL = "https://api.openai.com/v1/chat/completions"; // OpenAI API endpoint for chat-based models

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