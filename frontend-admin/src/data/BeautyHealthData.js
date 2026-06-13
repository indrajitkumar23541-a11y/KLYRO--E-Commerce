const BeautyHealthData = {
    hero: {
        title: "Beauty & Health",
        titleAccent: "Care",
        subtitle: "Glow from Within with Our Curated Care.",
        image: "/assets/beauty_hero.png",
        bullets: ["Dermatologist Tested", "Organic Ingredients", "Premium Brands", "Personalized Care"]
    },
    categories: [
        { id: 'skincare', name: 'Skincare', sub: 'Serums, Creams, Masks', img: '/assets/cat_skincare.png' },
        { id: 'haircare', name: 'Haircare', sub: 'Shampoos, Oils, Styling', img: '/assets/cat_haircare.png' },
        { id: 'makeup', name: 'Makeup', sub: 'Face, Eyes, Lips', img: '/assets/cat_makeup.png' },
        { id: 'fragrance', name: 'Fragrance', sub: 'Perfumes, Deos', img: '/assets/cat_fragrance.png' }
    ],
    brands: [
        { name: 'Loreal', logo: '/assets/brands/loreal.svg' },
        { name: 'Lakme', logo: '/assets/brands/lakme.svg' },
        { name: 'Mamaearth', logo: '/assets/brands/mamaearth.svg' },
        { name: 'Dove', logo: '/assets/brands/dove.svg' }
    ],
    trustBadges: [
        { icon: 'ShieldCheck', title: '100% Original', sub: 'Authentic products only' },
        { icon: 'Zap', title: 'Same Day Dispatch', sub: 'Order before 2 PM' },
        { icon: 'RotateCcw', title: 'Easy Returns', sub: 'No-hassle policy' },
        { icon: 'Headphones', title: 'Beauty Experts', sub: 'Live chat support' }
    ]
};

export default BeautyHealthData;
