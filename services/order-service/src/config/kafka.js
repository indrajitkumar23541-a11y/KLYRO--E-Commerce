const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'klyro-order-service',
    brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
});

const producer = kafka.producer();

const connectProducer = async () => {
    try {
        await producer.connect();
        console.log('✅ Kafka Producer connected securely');
    } catch (error) {
        console.error('❌ Kafka Producer connection error:', error);
    }
};

module.exports = { kafka, producer, connectProducer };
