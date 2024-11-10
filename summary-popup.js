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
        this.closeButton.textContent = '×'; // Close icon

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

        // Append the audio button to the audio container
        this.audioContainer.appendChild(this.audioButton);

        // Initialize the audio element
        this.audio = new Audio();
        this.isPlaying = false;

        // Append elements to the popup
        this.popup.appendChild(this.titleBar);
        this.popup.appendChild(this.summaryText);
        this.popup.appendChild(this.audioContainer);

        // Add the popup to the document body
        document.body.appendChild(this.popup);

        // Initially hide the popup
        this.hide();
    }

    show(x, y) {
        // Position the popup and make it visible
        this.popup.style.left = x + 'px';
        this.popup.style.top = y + 'px';
        this.popup.style.display = 'flex'; // Changed to 'flex' for flex-direction
    }

    hide() {
        // Hide the popup and reset audio
        this.popup.style.display = 'none';
        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
            this.audioButton.textContent = 'Play';
        }
    }

    updateContent(summaryText, audioData) {
        // Update the summary text
        if (summaryText !== null) {
            this.summaryText.textContent = summaryText;
        }

        // Update the audio source
        if (audioData) {
            this.audio.src = audioData;
            this.audioButton.disabled = false;
        } else {
            this.audio.src = '';
            this.audioButton.disabled = true;
        }
    }

    toggleAudio() {
        // Play or pause the audio
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
