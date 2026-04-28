const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'klyro-notification-service',
    brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'notification-service-group' });

const connectConsumer = async () => {
    try {
        await consumer.connect();
        console.log('✅ Kafka Consumer connected securely');
    } catch (error) {
        console.error('❌ Kafka Consumer connection error:', error);
    }
};

module.exports = { kafka, consumer, connectConsumer };
