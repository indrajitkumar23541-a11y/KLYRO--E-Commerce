const axios = require('axios');

const chatWithExpert = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ success: false, message: 'No input provided' });

        // Logic: Consult Search Service to find relevant products
        const searchServiceUrl = process.env.SEARCH_SERVICE_URL || 'http://search-service:5005';
        const searchResponse = await axios.get(`${searchServiceUrl}/api/search?q=${encodeURIComponent(message)}&limit=3`);
        const foundProducts = searchResponse.data.products || [];

        let contextText = "No specific products found for this query.";
        if (foundProducts.length > 0) {
            contextText = "Here are some relevant products from our database:\n";
            foundProducts.forEach(p => {
                contextText += `- ${p.name} (Price: ${p.price}, Rating: ${p.rating})\n`;
            });
        }

        const systemPrompt = `You are an AI Product Expert for the e-commerce platform KLYRO.
Your job is to assist customers by recommending products based on the context provided.
Be polite, highly professional, and brief. Mention the product names and prices if relevant.
Do not hallucinate products that are not in the context.

Context:
${contextText}

User says: ${message}`;

        let aiResponse = "";
        
        try {
            const ollamaUrl = process.env.OLLAMA_URL || 'http://ollama:11434';
            const ollamaResponse = await axios.post(`${ollamaUrl}/api/generate`, {
                model: 'qwen2:0.5b',
                prompt: systemPrompt,
                stream: false
            });
            aiResponse = ollamaResponse.data.response;
        } catch (ollamaErr) {
            console.error('Ollama connection failed:', ollamaErr.message);
            // Fallback response if Ollama is unreachable or model not pulled yet
            if (foundProducts.length > 0) {
                aiResponse = `(Fallback) Based on your request, I highly recommend checking out the ${foundProducts[0].name} for ₹${foundProducts[0].price}.`;
            } else {
                aiResponse = "(Fallback) I couldn't find an exact match for that request. Are you looking for something else?";
            }
        }

        res.json({ success: true, response: aiResponse, products: foundProducts });
    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ success: false, response: "My cognitive circuits are currently recalibrating. Please try again in a moment." });
    }
};

module.exports = { chatWithExpert };
