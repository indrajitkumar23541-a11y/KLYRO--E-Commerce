const GroceryV2Data = {
    hero: {
        title: "Grocery & Essentials",
        subtitle: "Fresh & Daily Needs Delivered to Your Doorstep",
        bullets: ["Farm Fresh Produce", "Daily Essentials", "Purity Guaranteed", "Express Delivery"],
        buttonText: "Shop Now",
        image: "/assets/grocery/hero.png"
    },
    quickCategories: [
        { name: "Fruits & Vegetables", img: "/assets/grocery/top_fruits.png" },
        { name: "Staples", img: "/assets/grocery/rice.png" },
        { name: "Dairy & Bakery", img: "/assets/grocery/top_dairy.png" },
        { name: "Snacks & Beverages", img: "/assets/grocery/snacks.png" }
    ],
    exclusiveOffers: [
        { id: 1, name: "Basmati Rice 5kg", originalPrice: 399, price: 299, img: "/assets/grocery/rice.png" },
        { id: 2, name: "Cooking Oil", originalPrice: 229, price: 149, img: "/assets/grocery/oil.png" },
        { id: 3, name: "Snacks Combo", originalPrice: 199, price: 149, img: "/assets/grocery/snacks.png", sub: "Chips, Biscuits, Namkeen" },
        { id: 4, name: "Home Cleaning", originalPrice: 150, price: 99, img: "/assets/grocery/cleaning.png", sub: "Start at ₹99" }
    ],
    topOffersTiles: [
        { name: "Fresh Fruits & Veggies", offer: "Up to 40% Off", img: "/assets/grocery/top_fruits.png", color: "bg-[#f4f7f0]" },
        { name: "Dairy & Eggs", offer: "Up to 30% Off", img: "/assets/grocery/top_dairy.png", color: "bg-[#fbf9f4]" },
        { name: "Breakfast Delights", offer: "Buy 1 Get 1 Free", img: "/assets/grocery/top_breakfast.png", color: "bg-[#fdf6f0]" },
        { name: "Household Essentials", offer: "Buy 2 Get 1 Free", img: "/assets/grocery/top_household.png", color: "bg-[#f4f6f9]" }
    ],
    brands: [
        { name: 'Tata Sampann', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Tata_Sampann_Logo.svg/1200px-Tata_Sampann_Logo.svg.png' },
        { name: 'Nestle', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Nestl%C3%A9_logo_2015.svg/1200px-Nestl%C3%A9_logo_2015.svg.png' },
        { name: 'Daawat', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/Daawat_Logo.png/640px-Daawat_Logo.png' },
        { name: 'Cavels', logo: 'https://via.placeholder.com/150?text=CAVELS' },
        { name: 'Surf Excel', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/Surf_Excel_logo.svg/1200px-Surf_Excel_logo.svg.png' },
        { name: 'Dove', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6d/Dove_logo.svg/1200px-Dove_logo.svg.png' },
        { name: 'Huggies', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3d/Huggies_logo.svg/1200px-Huggies_logo.svg.png' },
        { name: 'Dr. Oetker', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f8/Dr._Oetker_logo.svg/1200px-Dr._Oetker_logo.svg.png' }
    ]
};

export default GroceryV2Data;
