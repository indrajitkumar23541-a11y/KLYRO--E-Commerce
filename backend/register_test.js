const axios = require('axios');

async function testRegister() {
    try {
        const response = await axios.post('http://localhost:5001/api/auth/register', {
            name: 'Test User',
            email: 'test' + Date.now() + '@example.com',
            password: 'password123'
        });
        console.log('Registration Success:', response.data);
    } catch (error) {
        console.error('Registration Failed:', error.response ? error.response.data : error.message);
    }
}

testRegister();
