const axios = require("axios");
require("dotenv").config();

const apiKey = process.env.HF_API_KEY;
const API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"; 

async function summarizeMeeting(text) {
    try {
        const inputText = `Summarize the following text in simple terms and explain any complex terms: ${text}`;

        const response = await axios.post(
            API_URL,
            {
                inputs: inputText,
                parameters: { max_length: 150, min_length: 50 },
            },
            {
                headers: { Authorization: `Bearer ${apiKey}` },
            }
        );

        // Check if the response contains a valid summary
        if (response.data && response.data[0] && response.data[0].summary_text) {
            const summary = response.data[0].summary_text;  
            console.log("Summary:", summary);
        } else {
            console.log("No summary found in response.");
        }
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
}

// Example content to summarize
const content = `
    Special rules apply when a depreciable property is exchanged. It can trigger a profit known as depreciation recapture, 
    which is taxed as ordinary income. In general, if you swap one building for another building, you can avoid this recapture. 
    However, if you exchange improved land with a building for unimproved land without a building, then the depreciation that you’ve 
    previously claimed on the building will be recaptured as ordinary income.
`;

// Call the function to summarize the example text
summarizeMeeting(content);
