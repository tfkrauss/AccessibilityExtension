

async function generateSpeechFromText(text, tabId) {
  const apiKey = ''; // Replace with your actual API key
  try {
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: "tts-1",
        voice: "alloy",
        input: text
      })
    });

    if (!response.ok) throw new Error("Failed to generate speech");

    // Get the response as a blob
    const audioBlob = await response.blob();

    // Convert the blob to a base64 string to send it to the content script
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Audio = reader.result.split(",")[1];

      // Send the base64 audio data to the content script
      chrome.tabs.sendMessage(tabId, { audioData: base64Audio });
    };
    reader.readAsDataURL(audioBlob);

    console.log("Audio blob sent to content script.");
  } catch (error) {
    console.error("Error generating speech:", error);
  }
}

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "selectedText") {
    generateSpeechFromText(request.text, sender.tab.id);
  }
});
