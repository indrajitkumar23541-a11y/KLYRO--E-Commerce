const BooksEducationData = {
    hero: {
        title: "Books & Education",
        titleAccent: "Knowledge",
        subtitle: "Unlock Your Potential with Our Curated Library.",
        image: "/assets/books_hero.png",
        bullets: ["Best Selling Authors", "Technical Guides", "Children's Classics", "Expert Learning"]
    },
    categories: [
        { id: 'fiction', name: 'Fiction', sub: 'Novels, Sci-Fi, Mystery', img: '/assets/cat_fiction.png' },
        { id: 'nonfiction', name: 'Non-Fiction', sub: 'Bio, History, Self-Help', img: '/assets/cat_nonfiction.png' },
        { id: 'academic', name: 'Academic', sub: 'Textbooks, References', img: '/assets/cat_academic.png' },
        { id: 'kids', name: 'Kids Books', sub: 'Fables, Learning Fun', img: '/assets/cat_kids_books.png' }
    ],
    brands: [
        { name: 'Penguin', logo: '/assets/brands/penguin.svg' },
        { name: 'HarperCollins', logo: '/assets/brands/harpercollins.svg' },
        { name: 'Scholastic', logo: '/assets/brands/scholastic.svg' },
        { name: 'Oxford', logo: '/assets/brands/oxford.svg' }
    ],
    trustBadges: [
        { icon: 'ShieldCheck', title: 'Top Rated', sub: 'Curated by experts' },
        { icon: 'Truck', title: 'Global Shipping', sub: 'Books sent worldwide' },
        { icon: 'RotateCcw', title: 'Easy Exchange', sub: 'Love it or swap it' },
        { icon: 'Headphones', title: 'Reading Advice', sub: '24/7 support' }
    ]
};

export default BooksEducationData;
