console.log("Content script loaded on page:", window.location.href);

//Hover effect for black border box
function addHoverEffect(){
    const divs = document.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6')

    //Add hover effect on all divs
    divs.forEach(div => {    

        // CHECK FOR INVALID NONTEXTUAL DIVS
        const hasOnlyInlineChildren = Array.from(div.children).every(child => {
            const display = window.getComputedStyle(child).display;
            return display === 'inline' || display === 'inline-block';
        });

        //Skip divs which may not be textual
        if (
            !hasOnlyInlineChildren ||
            div.tagName === 'A' ||     // Is a link
            div.tagName === 'BUTTON' ||// Is a button
            div.hasAttribute('onclick') // Has onclick event
        ) {
            return; // Skip this element
        }
        


        //OUTLINE ON HOVER EVENTS

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

        const origOutline = div.style.outline;
        div.addEventListener("mouseover", () => {
            div.style.outline = `2px solid ${borderColor}`;
            div.style.cursor = "pointer";
        })
        
        div.addEventListener("mouseout", () => {
            div.style.outline = origOutline;
        })
        


        //CLICK EVENTS
        div.addEventListener("click", () => {
            const text = div.textContent;
            console.log(text);
        })
    })
}



addHoverEffect();