const { pool } = require('../config/db');

// @desc    Handle AI Concierge Chat (Order Specific)
// @route   POST /api/support/chat
// @access  Private
const handleConciergeChat = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.id;

        if (!message) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        // Fetch user orders for context
        const [orders] = await pool.query(`
            SELECT o.id, o.status, o.total_price, oi.product_id, p.name as product_name
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC
        `, [userId]);

        const query = message.toLowerCase();
        let response = "I am the KLYRO Concierge. How may I assist you with your luxury acquisitions today?";

        // Simple Smart Logic (Deterministic AI for high fidelity)
        if (query.includes('order') || query.includes('track') || query.includes('where')) {
            if (orders.length > 0) {
                const latest = orders[0];
                response = `Your most recent acquisition, the "${latest.product_name}" (Order #${latest.id}), is currently in the ${latest.status.toUpperCase()} stage of our logistics protocol.`;
            } else {
                response = "It appears your vault has no recent acquisitions to track. Would you like to explore our latest designer collections?";
            }
        } else if (query.includes('return') || query.includes('refund')) {
            response = "KLYRO maintains a rigorous 30-day de-acquisition policy for verified members. You can initiate a retrieval protocol directly from your Order History page.";
        } else if (query.includes('hello') || query.includes('hi')) {
            response = `Greetings, ${req.user.name}. I am your KLYRO Intelligence partner. I can help you track logistics, manage returns, or provide styling insights.`;
        } else {
            response = "A fascinating question. While I'm primarily focused on your current acquisitions and logistics, our global team of curators is always available for bespoke inquiries.";
        }

        res.json({ success: true, response });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Handle AI Product Expert Analysis
// @route   POST /api/support/expert
// @access  Public
const handleProductExpert = async (req, res) => {
    try {
        const { productId, query } = req.body;

        if (!productId) {
            return res.status(400).json({ success: false, message: 'Product ID is required' });
        }

        // Fetch product details
        const [products] = await pool.query(`
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE p.id = ?
        `, [productId]);

        if (products.length === 0) {
            return res.status(404).json({ success: false, message: 'Consignment not found' });
        }

        const product = products[0];
        const userQuery = query?.toLowerCase() || '';

        let response = "";

        // Boutique Style Analysis Parser
        if (userQuery.includes('material') || userQuery.includes('quality') || userQuery.includes('made')) {
            response = `The ${product.name} is meticulously curated from premium grade materials. Its construction reflects KLYRO's dedication to architectural integrity and tactile luxury.`;
        } else if (userQuery.includes('style') || userQuery.includes('wear') || userQuery.includes('look')) {
            response = `As part of our ${product.category_name} collection, this item is designed for sophisticated impact. We recommend pairing it with minimalist accents to let its natural silhouette lead yours.`;
        } else {
            // General sophisticated summary
            response = `The ${product.name} is a cornerstone of our ${product.category_name} curation. Priced at ₹${product.price.toLocaleString()}, it represents a high-integrity acquisition for those seeking to refine their personal collection with ${product.description ? 'items that offer ' + product.description.substring(0, 50) + '...' : 'contemporary silhouettes'}.`;
        }

        res.json({ success: true, response });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    handleConciergeChat,
    handleProductExpert
};
