const apiKey = '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';  
const API_URL = "https://api.openai.com/v1/chat/completions"; // OpenAI API endpoint for chat-based models

async function generateSummaryAndExplanation(text) {
    try {
        const prompt = `
            Please summarize the following text in simple terms and explain any complex or niche terms in a way that someone without much prior knowledge of the subject can easily understand. 
    Use clear, everyday language, and break down any difficult concepts. Do not include the original text in your response.

    Text: ${text}
        `;

        const response = await axios.post(
            API_URL,
            {
                model: "gpt-3.5-turbo",  
                messages: [
                    { role: "user", content: prompt }
                ],
                max_tokens: 150,  // Limit response length
                temperature: 0.7,  // Control randomness
                top_p: 1,
                n: 1
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data && response.data.choices && response.data.choices[0].message.content) {
            const summary = response.data.choices[0].message.content;
            console.log(summary);
        } else {
            console.log("No response generated.");
        }
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
}

const content = `
    Although pore size distribution provides insight into the porous structure of polymers, the bottlenecks or 
    pore gates between interconnected micropores are the key structural feature that determine ion transport rate
     and selectivity (Fig. 1a). However, pore gate sizes are difficult to characterize using standard experimental
      techniques, whereas in molecular simulations, random segmental motions of polymer chains create transient pores
       that deviate from static models27. 
`;

// Call the function with example content
generateSummaryAndExplanation(content);
