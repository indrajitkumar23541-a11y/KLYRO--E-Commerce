async function testAI() {
    try {
        console.log('Testing AI Service via API Gateway...');
        const response = await fetch('http://localhost:5000/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: "I am looking for a nice shirt for men" })
        });
        const data = await response.json();
        console.log('✅ AI Response:', data.response);
        console.log('📦 Products Found:', data.products.map(p => p.name));
    } catch (error) {
        console.error('❌ Error:', error);
    }
}
testAI();
