const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'klyro-product-service',
    brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'product-service-group' });

const connectConsumer = async () => {
    try {
        await consumer.connect();
        console.log('✅ Kafka Consumer connected securely');
    } catch (error) {
        console.error('❌ Kafka Consumer connection error:', error);
    }
};

module.exports = { kafka, consumer, connectConsumer };
