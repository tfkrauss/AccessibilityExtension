export default class SummaryPopup {
    constructor() {
        this.popupElement = this.createPopupElement();
    }

    createPopupElement() {
        const popup = document.createElement('div');
        popup.classList.add('summary-popup');

        // Add a close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.addEventListener('click', () => {
            this.hide();
        });
        popup.appendChild(closeButton);

        return popup;
    }

    appendToParent(parent) {
        parent.appendChild(this.popupElement);
    }

    // show(content, x, y) {
    //     this.popupElement.innerHTML = ''; // Clear previous content
    //     this.popupElement.textContent = content; // Set new content
    //     this.popupElement.style.left = `${x}px`;
    //     this.popupElement.style.top = `${y}px`;
    //     this.popupElement.style.display = 'block'; // Show the popup

    //     // Append the close button again (if needed)
    //     const closeButton = document.createElement('button');
    //     closeButton.textContent = 'Close';
    //     closeButton.addEventListener('click', () => {
    //         this.hide();
    //     });
    //     this.popupElement.appendChild(closeButton);
    // }

    hide() {
        this.popupElement.style.display = 'none';
    }
}


// Example usage:
// Assuming you have an event listener that triggers the summary popup

// document.querySelectorAll('p').forEach(paragraph => {
//     paragraph.addEventListener('click', (event) => {
//         const summaryText = 'This is a sample summary for the paragraph. Click close to dismiss.';
//         const popup = new SummaryPopup();
//         popup.show(summaryText, event.pageX, event.pageY);
//     });
// });
