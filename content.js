// content.js

console.log("Content script loaded.");

let audioDataGlobal = null;
let audioPlayed = false;

// Notify the background script
chrome.runtime.sendMessage({ message: "contentScriptLoaded" });

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.audioData) {
    const audioData = `data:audio/mp3;base64,${message.audioData}`;
    audioDataGlobal = audioData; // Store it globally

    // Add event listener for user interaction
    document.addEventListener('click', playAudioOnInteraction);
    document.addEventListener('keydown', playAudioOnInteraction);
    console.log("Event listeners added for user interaction.");
  }
});

function playAudioOnInteraction() {
  if (!audioPlayed && audioDataGlobal) {
    const audio = new Audio(audioDataGlobal);
    audio.play()
      .then(() => {
        console.log("Audio playback started.");
        audioPlayed = true;
      })
      .catch((error) => {
        console.error("Error playing audio:", error);
      });

    // Remove event listeners after playing
    document.removeEventListener('click', playAudioOnInteraction);
    document.removeEventListener('keydown', playAudioOnInteraction);
    console.log("Event listeners removed after audio playback.");
  }
}
