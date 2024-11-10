// Link css to html
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = chrome.runtime.getURL('./summary-popup.css');
document.head.appendChild(link);

let currentAudio = null;
const summaryPopup = new SummaryPopup();

// TTS portion - Handle the audio message and create the Audio object
function read(text) {
    // Send the selected text to the background script
    chrome.runtime.sendMessage({ message: "selectedText", text: text });
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.audioData) {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        const audioData = `data:audio/mp3;base64,${message.audioData}`;
        currentAudio = new Audio(audioData);

        // Add event listener for when the audio ends
        currentAudio.addEventListener('ended', () => {
            currentAudio = null;
            // Reset button to Play when audio ends
            if (summaryPopup.audioButton) {
                summaryPopup.audioButton.textContent = 'Play';
            }
        });

        // Initially update the button text based on current state
        if (summaryPopup.audioButton) {
            summaryPopup.audioButton.textContent = 'Play';  // Default to 'Play'
        }
    }
});


// Hover effect for black border box
function addHoverEffect() {
    const divs = document.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6');

    divs.forEach(div => {
        const hasOnlyInlineChildren = Array.from(div.children).every(child => {
            const display = window.getComputedStyle(child).display;
            return display === 'inline' || display === 'inline-block';
        });

        if (
            !hasOnlyInlineChildren ||
            div.tagName === 'A' || 
            div.tagName === 'BUTTON' || 
            div.hasAttribute('onclick') || 
            div.textContent.length < 100
        ) {
            return;
        }

        function getEffectiveBackgroundColor(el) {
            let backgroundColor = window.getComputedStyle(el).backgroundColor;
            let currentElement = el;

            while (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
                currentElement = currentElement.parentElement;
                if (!currentElement) {
                    return 'rgb(255, 255, 255)';
                }
                backgroundColor = window.getComputedStyle(currentElement).backgroundColor;
            }
            return backgroundColor;
        }

        function isDarkBackground(color) {
            if (!color) return false;

            const rgb = color.match(/\d+/g);
            if (rgb) {
                const [r, g, b] = rgb.map(Number);
                const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                return brightness < 128;
            }
            return false;
        }

        const bgColor = getEffectiveBackgroundColor(div);
        const borderColor = isDarkBackground(bgColor) ? 'white' : 'rgb(200, 200, 200)';
        const origCursor = div.style.cursor;
        const origOutline = div.style.outline;

        div.addEventListener("mouseover", () => {
            div.style.outline = `1.5px solid ${borderColor}`;
            div.style.borderRadius = "5px";
        });

        div.addEventListener("mouseout", () => {
            div.style.outline = origOutline;
            div.style.cursor = origCursor;
        });

        div.addEventListener("mouseup", async (e) => {
            let selectedText = window.getSelection().toString().trim();
            if (!selectedText) {
                selectedText = div.textContent;
            }

            const rect = div.getBoundingClientRect();
            let x = rect.right + window.scrollX + 10;
            let y = rect.top + window.scrollY;

            if (x + summaryPopup.popup.offsetWidth > window.innerWidth) {
                x = rect.left + window.scrollX - summaryPopup.popup.offsetWidth - 10;
            }

            summaryPopup.show(x, y);
            await summaryPopup.updateContent(selectedText);
        });
    });
}

function summarizeText(text) {
    console.log(text);
    // Send the text to the background script to get the summary
}

addHoverEffect();
