const HomeLivingData = {
    hero: {
        title: "Home",
        titleAccent: "Living",
        subtitle: "Style Your Home, Refresh Your Living Space",
        image: "/assets/home/hero_v2.png",
        bullets: ["Premium Furniture", "Luxe Decor", "Designer Kitchen", "Organic Living"]
    },
    categories: [
        { id: 17, name: "Furniture", image: "/assets/home/cat_furniture.png", sub: "Designer Sofas & Beds" },
        { id: 19, name: "Home Décor", image: "/assets/home/cat_decor.png", sub: "Luxe Wall Art & Vases" },
        { id: 18, name: "Kitchen", image: "/assets/home/cat_kitchen.png", sub: "Premium Culinary Tools" },
        { id: 16, name: "Home Furnishing", image: "/assets/home/cat_furnishing.png", sub: "Silk Curtains & More" },
        { id: 20, name: "Lighting", image: "/assets/home/cat_lighting.png", sub: "Crystal Chandeliers" },
        { id: 16, name: "Appliances", image: "/assets/home/cat_appliances.png", sub: "Smart Home Tech" }
    ],
    promoDeals: {
        title: "Home Decor Deals",
        subtitle: "Wall Art, Decoration & More",
        image: "/assets/home/promo_decor.png"
    },
    topDeals: [
        {
            title: "Bedroom Furniture",
            offer: "Up to 60% Off",
            image: "/assets/home/deal_bedroom.png"
        },
        {
            title: "Kitchen Essentials",
            offer: "Up to 50% Off",
            image: "/assets/home/deal_kitchen.png"
        }
    ],
    topPicks: [
        {
            id: 'hl1',
            name: "Light Wood Bed",
            price: 7998,
            image: "/assets/home/cat_furniture.png"
        },
        {
            id: 'hl2',
            name: "Decorative Vases",
            price: 899,
            image: "/assets/home/cat_decor.png"
        },
        {
            id: 'hl3',
            name: "Nonstick Cookware Set",
            price: 1599,
            image: "/assets/home/cat_kitchen.png"
        },
        {
            id: 'hl4',
            name: "Cotton Bedsheets",
            price: 299,
            image: "/assets/home/item_bedsheet.png"
        },
        {
            id: 'hl5',
            name: "Modern Floor Starge",
            price: 599,
            image: "/assets/home/item_floorstarge.png"
        }
    ],
    brands: [
        { name: "IKEA", logo: "/assets/home/brands/ikea.svg" },
        { name: "Pepperfry", logo: "/assets/home/brands/pepperfry.svg" },
        { name: "Fabindia", logo: "/assets/home/brands/fabindia.svg" },
        { name: "Sleepwell", logo: "/assets/home/brands/sleepwell.svg" },
        { name: "Godrej Interio", logo: "/assets/home/brands/godrej.svg" },
        { name: "H&M Home", logo: "/assets/home/brands/hmhome.svg" }
    ],
    expertTips: [
        {
            title: "The Art of Layering",
            subtitle: "Interior Styling Guide",
            content: "### Choose Your Base\nStart with a neutral foundation—like a sand-colored sofa or a cream rug. This allows your statement pieces to truly shine without overwhelming the senses.\n\n### Texture is Key\nMix and match materials. Combine the coolness of marble with the warmth of velvet or the organic feel of jute to create depth and interest in any room.\n\n### Lighting Levels\nNever rely on a single overhead light. Use a combination of floor lamps, table lamps, and sconces to create a warm, inviting 'layer' of light that can be adjusted for any mood."
        }
    ]
};

export default HomeLivingData;
