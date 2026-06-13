import API from '../api/axios';

// Example of how to use in a component
const fetchProducts = async () => {
    try {
        const response = await API.get('/products');
        return response.data;
    } catch (error) {
        console.error('Frontend API Error:', error);
        throw error;
    }
};

export default fetchProducts;
