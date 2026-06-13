const ElectronicsData = {
    hero: {
        title: "Electronics",
        titleAccent: "Tech",
        subtitle: "The Latest Gadgets at Your Fingertips.",
        image: "/assets/electronics_hero_v2.png",
        bullets: ["Premium Gear", "Innovation", "Next-Gen Tech", "Reliable Support"]
    },
    categories: [
        { id: 'mobiles', name: 'Mobiles', sub: 'Smartphones, Accessories', img: '/assets/cat_mobiles.png' },
        { id: 'laptops', name: 'Laptops', sub: 'Gaming, Ultrabooks', img: '/assets/cat_laptops.png' },
        { id: 'tablets', name: 'Tablets', sub: 'iPads, Android Tablets', img: '/assets/cat_tablets.png' },
        { id: 'gadgets', name: 'Smart Gadgets', sub: 'Smartwatches, Speakers', img: '/assets/cat_gadgets.png' }
    ],
    brands: [
        { name: 'Samsung', logo: '/assets/brands/samsung.svg' },
        { name: 'Apple', logo: '/assets/brands/apple.svg' },
        { name: 'HP', logo: '/assets/brands/hp.svg' },
        { name: 'Dell', logo: '/assets/brands/dell.svg' },
        { name: 'Sony', logo: '/assets/brands/sony.svg' },
        { name: 'OnePlus', logo: '/assets/brands/oneplus.svg' }
    ],
    trustBadges: [
        { icon: 'Zap', title: 'Latest Tech Deals', sub: 'Top Discounts & Offers' },
        { icon: 'Truck', title: 'Fast & Secure Delivery', sub: 'On orders above ₹999' },
        { icon: 'RotateCcw', title: 'Easy Returns', sub: 'Hassle Free 7 Days' },
        { icon: 'Headphones', title: '24/7 Expert Support', sub: 'Technical assistance' }
    ]
};

export default ElectronicsData;
