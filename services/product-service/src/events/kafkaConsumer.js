const { consumer } = require('../config/kafka');
const { pool } = require('../config/db');

const setupKafkaConsumer = async () => {
    try {
        await consumer.subscribe({ topic: 'klyro.orders.created', fromBeginning: true });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const event = JSON.parse(message.value.toString());
                console.log(`📦 Product Service received event [${topic}]:`, event);
                
                if (topic === 'klyro.orders.created') {
                    // Reduce inventory logic here (if inventory column exists)
                    console.log(`📦 Processing inventory deduction for Order ${event.orderId}`);
                    // Mock inventory deduction for demo
                    // for (const item of event.items) {
                    //     await pool.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.productId]);
                    // }
                }
            },
        });
        console.log('✅ Product Service Kafka Consumer is listening for events...');
    } catch (error) {
        console.error('❌ Error setting up Kafka consumer:', error);
    }
};

module.exports = setupKafkaConsumer;
