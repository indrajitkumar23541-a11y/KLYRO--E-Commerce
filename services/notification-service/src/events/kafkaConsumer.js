const { consumer } = require('../config/kafka');

const setupKafkaConsumer = async () => {
    try {
        await consumer.subscribe({ topic: 'klyro.orders.created', fromBeginning: true });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const event = JSON.parse(message.value.toString());
                console.log(`🔔 Notification Service received event [${topic}]:`, event);
                
                if (topic === 'klyro.orders.created') {
                    console.log(`🔔 Sending Order Confirmation Notification for Order ${event.orderId} to User ${event.userId}`);
                    // In a real app, send email/SMS here
                }
            },
        });
        console.log('✅ Notification Service Kafka Consumer is listening for events...');
    } catch (error) {
        console.error('❌ Error setting up Kafka consumer:', error);
    }
};

module.exports = setupKafkaConsumer;
