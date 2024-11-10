class SummaryPopup {
    constructor() {
        // Create the popup container
        this.popup = document.createElement('div');
        this.popup.className = 'summary-popup';

        // Create the title bar with 'Summary' text and a close button
        this.titleBar = document.createElement('div');
        this.titleBar.className = 'summary-popup-title';

        this.titleText = document.createElement('span');
        this.titleText.textContent = 'Summary';

        this.closeButton = document.createElement('button');
        this.closeButton.className = 'summary-popup-close';
        this.closeButton.textContent = '×';

        this.closeButton.addEventListener('click', () => {
            this.hide();
        });

        this.titleBar.appendChild(this.titleText);
        this.titleBar.appendChild(this.closeButton);

        // Create the summary text area
        this.summaryText = document.createElement('div');
        this.summaryText.className = 'summary-popup-text';

        // Create the audio controls container
        this.audioContainer = document.createElement('div');
        this.audioContainer.className = 'summary-popup-audio-container';

        // Create the audio play/pause button
        this.audioButton = document.createElement('button');
        this.audioButton.className = 'summary-popup-audio-button';
        this.audioButton.textContent = 'Play';

        this.audioButton.addEventListener('click', () => {
            this.toggleAudio();
        });

        this.audioContainer.appendChild(this.audioButton);

        // Initialize the audio element
        this.audio = new Audio();
        this.isPlaying = false;

        // Append all elements to the popup
        this.popup.appendChild(this.titleBar);
        this.popup.appendChild(this.summaryText);
        this.popup.appendChild(this.audioContainer);

        // Add the popup to the document body
        document.body.appendChild(this.popup);

        // Initially hide the popup
        this.hide();
    }

    show(x, y) {
        this.popup.style.left = x + 'px';
        this.popup.style.top = y + 'px';
        this.popup.style.display = 'flex';
    }

    hide() {
        this.popup.style.display = 'none';
        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
            this.audioButton.textContent = 'Play';
        }
    }

    async updateContent(selectedText) {
        this.summaryText.textContent = "Loading summary...";

        try {
            const response = await new Promise((resolve, reject) => {
                chrome.runtime.sendMessage(
                    { action: 'generateSummary', text: selectedText },
                    (response) => {
                        if (chrome.runtime.lastError) {
                            reject(new Error(chrome.runtime.lastError.message));
                            return;
                        }
                        resolve(response);
                    }
                );
            });

            if (!response) {
                throw new Error('No response from the background script');
            }

            if (!response.success) {
                throw new Error(response.error || 'Failed to generate summary');
            }

            this.summaryText.textContent = response.summary;
            
            // Trigger text-to-speech with the summary
            chrome.runtime.sendMessage({ 
                message: "selectedText", 
                text: response.summary 
            });

        } catch (error) {
            console.error('Summary generation error:', error);
            this.summaryText.textContent = "Error: " + error.message;
        }
    }

    toggleAudio() {
        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
            this.audioButton.textContent = 'Play';
        } else {
            this.audio.play();
            this.isPlaying = true;
            this.audioButton.textContent = 'Pause';
        }
    }
}