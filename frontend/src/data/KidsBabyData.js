const KidsBabyData = {
    hero: {
        title: "Kids & Baby",
        subtitle: "Everything Your Little Ones Need",
        image: "/assets/kids/hero.png",
        bullets: [
            "Toys, Clothing, Baby Care & More",
            "Up to 50% OFF",
            "Top Brands & Great Deals"
        ]
    },
    categories: [
        { id: 43, name: "Toys", image: "/assets/kids/cat_toys.png", sub: "Plush, Educational, Games" },
        { id: 44, name: "Baby Care", image: "/assets/kids/cat_babycare.png", sub: "Skincare, Diapers, Bath" },
        { id: 45, name: "Clothing", image: "/assets/kids/cat_clothing.png", sub: "Girls, Boys, Infants" },
        { id: 12, name: "Footwear", image: "/assets/kids/cat_footwear.png", sub: "Sneakers, Sandals, Boots" },
        { id: 65, name: "Learning", image: "/assets/kids/cat_learning.png", sub: "Books, STEM, Art" }
    ],
    deals: [
        {
            title: "Toys",
            offer: "Up to 50% OFF",
            image: "/assets/kids/cat_toys.png",
            color: "bg-[#e67e22]"
        },
        {
            title: "Baby Care",
            offer: "Up to 40% OFF",
            image: "/assets/kids/cat_babycare.png",
            color: "bg-[#f1c40f]"
        }
    ],
    bestsellers: [
        {
            id: 'kb1',
            name: "Plush Teddy Bear",
            price: 499,
            oldPrice: 1699,
            image: "/assets/kids/cat_toys.png"
        },
        {
            id: 'kb2',
            name: "Baby Skincare Kit",
            price: 599,
            oldPrice: 799,
            image: "/assets/kids/cat_babycare.png"
        },
        {
            id: 'kb3',
            name: "Kids Learning Laptop",
            price: 899,
            oldPrice: 1299,
            image: "/assets/kids/cat_learning.png"
        },
        {
            id: 'kb4',
            name: "Car Toy Playset",
            price: 749,
            oldPrice: 1999,
            image: "/assets/kids/cat_learning.png"
        }
    ],
    brands: [
        { name: "Johnson's", logo: "/assets/kids/brands/johnsons.svg" },
        { name: "LEGO", logo: "/assets/kids/brands/lego.svg" },
        { name: "Pampers", logo: "/assets/kids/brands/pampers.svg" },
        { name: "Chicco", logo: "/assets/kids/brands/chicco.svg" },
        { name: "Fisher-Price", logo: "/assets/kids/brands/fisher-price.svg" }
    ],
    expertTips: [
        {
            title: "Safety First Guides",
            subtitle: "Expert Parenting Advice",
            content: "### Non-Toxic Play\nEnsure all toys are BPA-free and made from organic materials. Look for the 'Safety Standard' certification on package labels to prevent skin irritation or allergies.\n\n### Developmental Milestones\nChoose toys that challenge your child's age-specific cognitive skills. STEM toys are excellent for fostering early problem-solving and critical thinking abilities.\n\n### Sleep Hygiene\nMaintain a consistent bedtime routine with soft, breathable cotton bedding. A dimly lit, cool room helps in improving the quality of deep sleep for infants."
        }
    ]
};

export default KidsBabyData;
