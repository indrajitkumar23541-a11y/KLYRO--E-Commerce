const SportsFitnessData = {
    hero: {
        title: "Sports & Fitness",
        subtitle: "Gear Up and Stay Fit",
        description: "Premium gym equipment, technical activewear, and expert-formulated nutrition for athletes of every level.",
        bullets: ["Professional Equipment", "Elite Activewear", "Performance Nutrition", "Expert Recovery"],
        buttonText: "Shop Bestsellers",
        backgroundImage: "/assets/sports_hero_couple.png"
    },
    categories: [
        { id: 27, name: 'Gym Gear', sub: 'Weights, Benches, Mats', img: '/assets/sports_hero.png' },
        { id: 41, name: 'Activewear', sub: 'Tees, Shorts, Shoes', img: '/assets/sports_promo.png' },
        { id: 28, name: 'Yoga', sub: 'Mats, Blocks, Straps', img: '/assets/sports_goal_active.png' },
        { id: 29, name: 'Outdoor', sub: 'Running, Cycling, Hiking', img: '/assets/sports_hero.png' },
        { id: 25, name: 'Nutrition', sub: 'Whey, Creatine, Pre-Wkt', img: '/assets/sports_promo.png' },
        { id: 6, name: 'Smart Tech', sub: 'Trackers, Scales, Rings', img: '/assets/sports_goal_stamina.png' },
        { id: 30, name: 'Recovery', sub: 'Massagers, Foam Rollers', img: '/assets/sports_goal_muscle.png' }
    ],
    promos: [
        { 
            discount: "Flat 25% OFF", 
            title: "Performance Whey", 
            sub: "on Sports Nutrition Brands", 
            code: "ATHLETE25", 
            img: "/assets/sports_goal_muscle.png",
            bg: "#F0F4FF"
        },
        { 
            discount: "Buy 1 Get 1", 
            title: "Premium Yoga Mats", 
            sub: "on Select Accessories", 
            img: "/assets/sports_goal_active.png",
            bg: "#FFF9E6"
        }
    ],
    tips: [
        { 
            title: "Build Muscle", 
            text: "Focus on progressive overload and high protein intake.", 
            icon: "Star", 
            color: "text-orange-400", 
            bg: "bg-orange-50" 
        },
        { 
            title: "Stay Hydrated", 
            text: "Drink at least 3-4 liters of water for peak performance.", 
            icon: "Heart", 
            color: "text-blue-400", 
            bg: "bg-blue-50" 
        },
        { 
            title: "Sleep & Recovery", 
            text: "8 hours of deep sleep is essential for muscle repair.", 
            icon: "Zap", 
            color: "text-purple-400", 
            bg: "bg-purple-50" 
        }
    ],
    brands: [
        { name: 'Nike', logo: '/assets/brands/nike.svg' },
        { name: 'Adidas', logo: '/assets/brands/adidas.svg' },
        { name: 'Puma', logo: '/assets/brands/puma.svg' },
        { name: 'Asics', logo: '/assets/brands/asics.svg' },
        { name: 'Under Armour', logo: '/assets/brands/under_armour.svg' },
        { name: 'MuscleBlaze', logo: '/assets/brands/muscleblaze.svg' }
    ],
    trustBadges: [
        { icon: 'ShieldCheck', title: '100% Authentic', sub: 'Direct from top-tier brands' },
        { icon: 'Zap', title: 'Express Delivery', sub: 'Same day shipping available' },
        { icon: 'RotateCcw', title: '30-Day Return', sub: 'No-questions-asked guarantee' },
        { icon: 'Headphones', title: 'Gear Expert', sub: '24/7 dedicated athlete support' }
    ]
};

export default SportsFitnessData;
