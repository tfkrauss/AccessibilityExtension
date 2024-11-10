// Link css to html
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = chrome.runtime.getURL('./summary-popup.css');
document.head.appendChild(link);

let currentAudio = null
summaryPopup = new SummaryPopup();

//TTS portion
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
            currentAudio = null;
        }
        const audioData = `data:audio/mp3;base64,${message.audioData}`;
        currentAudio = new Audio(audioData);

        currentAudio.addEventListener('ended', () => {
            currentAudio = null;
        });
        currentAudio.play()
            .then(() => {
                console.log("Audio playback started.");
            })
            .catch((error) => {
                console.error("Error playing audio:", error);
            });
        console.log("Attempted to play audio from background message.");
    }
});

//Hover effect for black border box
function addHoverEffect() {
    const divs = document.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6')

    //Add hover effect on all divs
    divs.forEach(div => {

        /*
        // CHECK FOR INVALID NONTEXTUAL DIVS
        */
        const hasOnlyInlineChildren = Array.from(div.children).every(child => {
            const display = window.getComputedStyle(child).display;
            return display === 'inline' || display === 'inline-block';
        });

        //Skip divs which may not be textual
        if (
            !hasOnlyInlineChildren ||
            div.tagName === 'A' ||     // Is a link
            div.tagName === 'BUTTON' || // Is a button
            div.hasAttribute('onclick') || // Has onclick event
            div.textContent.length < 100  // Less than a sentence
        ) {
            return; // Skip this element
        }


        /*
        //OUTLINE ON HOVER EVENTS
        */
        function getEffectiveBackgroundColor(el) {
            let backgroundColor = window.getComputedStyle(el).backgroundColor;
            let currentElement = el;

            // Traverse up through parent elements to find a non-transparent background
            while (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
                currentElement = currentElement.parentElement;
                if (!currentElement) {
                    return 'rgb(255, 255, 255)'; // Default to white if no background found
                }
                backgroundColor = window.getComputedStyle(currentElement).backgroundColor;
            }
            return backgroundColor;
        }

        // Helper function to determine brightness
        function isDarkBackground(color) {
            if (!color) return false;

            const rgb = color.match(/\d+/g);
            if (rgb) {
                const [r, g, b] = rgb.map(Number);
                const brightness = (r * 299 + g * 587 + b * 114) / 1000; // Luminance formula
                return brightness < 128; // Threshold for dark background
            }
            return false;
        }

        // Determine the border color based on the background color
        const bgColor = getEffectiveBackgroundColor(div);
        const borderColor = isDarkBackground(bgColor) ? 'white' : 'black';
        const origCursor = div.style.cursor;
        const origOutline = div.style.outline;

        div.addEventListener("mouseover", () => {
            div.style.outline = `2px solid ${borderColor}`;
            //div.style.cursor = "pointer";
        })

        div.addEventListener("mouseout", () => {
            div.style.outline = origOutline;
            div.style.cursor = origCursor;
        })


        /*
        //TEXT SELECTION ON MOUSEUP EVENT & CLICK EVENT
        */
        // Check for selected text on mouseup
        div.addEventListener("mouseup", (e) => {
            let selectedText = window.getSelection().toString().trim();
            if (!selectedText) {
                selectedText = div.textContent;
            }

            // Get the bounding rectangle of the element
            const rect = div.getBoundingClientRect();
            // Calculate position for the popup
            let x = rect.right + window.scrollX + 10;
            let y = rect.top + window.scrollY;
            // Adjust position if the popup goes off-screen
            if (x + summaryPopup.popup.offsetWidth > window.innerWidth) {
                x = rect.left + window.scrollX - summaryPopup.popup.offsetWidth - 10;
            }
            summaryPopup.show(x, y);
            summaryPopup.updateContent(selectedText, read(selectedText));
        });
    })
}

function summarizeText(text) {
    console.log(text);
    // Send the text to the background script to get the summary
    // chrome.runtime.sendMessage({ action: 'summarizeText', text: text });
}



addHoverEffect();