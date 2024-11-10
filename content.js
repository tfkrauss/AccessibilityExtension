import SummaryPopup from "./summary-popup.js";
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = chrome.runtime.getURL('styles.css');
document.head.appendChild(link);

const summaryPopup = new SummaryPopup();

const allParagraphs = document.querySelectorAll("p");
allParagraphs.forEach(function (elem) {
    elem.addEventListener("click", function () {
        summaryPopup.appendToParent(elem)
    });
})