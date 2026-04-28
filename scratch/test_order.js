

async function testKafkaOrderFlow() {
    try {
        console.log('1. Logging in...');
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test3@klyro.com',
                password: 'password123'
            })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('✅ Logged in successfully. Token received.');

        console.log('2. Placing an order...');
        const orderRes = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                orderItems: [
                    { product: 8708, quantity: 1, price: 500 }
                ],
                shippingAddress: {
                    address: 'Test Street',
                    city: 'Test City',
                    postalCode: '123456',
                    country: 'India'
                },
                paymentMethod: 'Cash on Delivery',
                totalPrice: 500
            })
        });
        const orderData = await orderRes.json();

        console.log('✅ Order placed successfully:', orderData);
    } catch (error) {
        console.error('❌ Error:', error.response ? error.response.data : error.message);
    }
}

testKafkaOrderFlow();
