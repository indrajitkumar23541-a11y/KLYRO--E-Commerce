const { consumer } = require('../config/kafka');

const setupKafkaConsumer = async () => {
    try {
        await consumer.subscribe({ topic: 'klyro.orders.created', fromBeginning: true });
        await consumer.subscribe({ topic: 'klyro.orders.return_requested', fromBeginning: true });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const event = JSON.parse(message.value.toString());
                console.log(`🔔 Notification Service received event [${topic}]:`, event);
                
                try {
                    const { pool } = require('../config/db');

                    if (topic === 'klyro.orders.created') {
                        const title = 'Order Confirmed';
                        const msg = `Your order #KY${event.orderId} has been successfully placed.`;
                        
                        // 1. Store in DB for In-App UI
                        await pool.query(
                            'INSERT INTO notifications (user_id, type, title, message) VALUES (?, ?, ?, ?)',
                            [event.userId, 'in-app', title, msg]
                        );
                        
                        console.log(`✅ Persisted notification for Order ${event.orderId} to DB`);
                    } else if (topic === 'klyro.orders.return_requested') {
                        const title = 'Return Initiated';
                        const msg = `We've received your return request for #KY${event.orderId}. Protocol check in progress.`;
                        
                        await pool.query(
                            'INSERT INTO notifications (user_id, type, title, message) VALUES (?, ?, ?, ?)',
                            [event.userId, 'alert', title, msg]
                        );
                        console.log(`✅ Persisted return notification for Order ${event.orderId}`);
                    }
                    
                    // Add more event types here as needed (shipped, etc)
                    
                } catch (dbError) {
                    console.error('❌ Failed to persist notification:', dbError);
                }
            },
        });
        console.log('✅ Notification Service Kafka Consumer is listening for events...');
    } catch (error) {
        console.error('❌ Error setting up Kafka consumer:', error);
    }
};

module.exports = setupKafkaConsumer;
