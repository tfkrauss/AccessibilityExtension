

async function generateSpeechFromText(text, tabId) {
  const apiKey = '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'; // Replace with your actual API key
  try {
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + apiKey // Replace with your OpenAI API Key
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
  if (request.message === "contentScriptLoaded") {
    console.log("Content script reported as loaded.");
    // Now we can proceed to generate the speech and send it to the content script.
    const sampleText = `
      This is a sample text block for testing. This will allow us to check if the audio is generated correctly and can be played in the content script.
    `;
    generateSpeechFromText(sampleText, sender.tab.id);
  }
});
