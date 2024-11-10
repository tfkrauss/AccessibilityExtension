
class SummaryPopup {
    constructor() {
        this.element = this.createPopupElement();
        const block = document.createElement('div');
        document.body.appendChild(block);
        block.classList.add('summary-block');
        block.appendChild(this.element);
    }

    createPopupElement() {
        const content = document.createElement('div');
        content.classList.add('summary-popup');

        const buttonBox = document.createElement('div');
        buttonBox.classList.add('button-container');
        content.appendChild(buttonBox);

        // Creating color-coded buttons
        const easyButton = document.createElement('div');
        easyButton.classList.add('popup-button', 'easy-button');
        buttonBox.appendChild(easyButton);

        const midButton = document.createElement('div');
        midButton.classList.add('popup-button', 'mid-button');
        buttonBox.appendChild(midButton);

        const hardButton = document.createElement('div');
        hardButton.classList.add('popup-button', 'hard-button');
        buttonBox.appendChild(hardButton);

        const summaryBox = document.createElement('div');
        content.appendChild(summaryBox);
        const title = document.createElement('h5');
        title.textContent = "Summary";
        summaryBox.appendChild(title);

        const summaryText = document.createElement('p');
        summaryText.textContent = "Placeholder summary text goes here.";
        summaryBox.appendChild(summaryText);

        // Add a close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.classList.add('close-button');
        closeButton.addEventListener('click', () => {
            this.hide();
        });
        content.appendChild(closeButton);

        return content;
    }

    show(x, y) {
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
        this.element.style.display = 'flex'; // Show the popup
    }

    hide() {
        this.element.style.display = 'none';
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