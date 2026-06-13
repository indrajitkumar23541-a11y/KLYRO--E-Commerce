const AutomotiveData = {
    hero: {
        title: "Automotive",
        titleAccent: "Elite",
        subtitle: "Premium Performance & Care for Your Machine.",
        image: "/assets/automotive_hero.png",
        bullets: ["Performance Tuning", "Premium Detailing", "Original Parts", "Expert Consultation"]
    },
    categories: [
        { id: 'parts', name: 'Spare Parts', sub: 'Engines, Brakes, Filters', img: '/assets/cat_parts.png' },
        { id: 'acc', name: 'Accessories', sub: 'Matts, Covers, Audio', img: '/assets/cat_accessories.png' },
        { id: 'care', name: 'Car Care', sub: 'Wax, Polish, Cleaners', img: '/assets/cat_care.png' },
        { id: 'tools', name: 'Tools', sub: 'Jacks, Wrenches, Scanners', img: '/assets/cat_tools.png' }
    ],
    brands: [
        { name: 'Bosch', logo: '/assets/brands/bosch.svg' },
        { name: '3M', logo: '/assets/brands/3m.svg' },
        { name: 'Castrol', logo: '/assets/brands/castrol.svg' },
        { name: 'Michelin', logo: '/assets/brands/michelin.svg' },
        { name: 'Shell', logo: '/assets/brands/shell.svg' }
    ],
    trustBadges: [
        { icon: 'ShieldCheck', title: 'Certified Parts', sub: '100% Genuine Guarantee' },
        { icon: 'Truck', title: 'Rapid Shipping', sub: 'Priority logistics' },
        { icon: 'RotateCcw', title: 'Easy Returns', sub: 'Hassle-free exchange' },
        { icon: 'Headphones', title: 'Tech Support', sub: 'Automotive experts' }
    ]
};

export default AutomotiveData;
