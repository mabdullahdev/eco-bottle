import mongoose from 'mongoose';
import { Product } from '../models/Product';
import { User } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const sampleProducts = [
  {
    name: "EcoFlow Pro Water Bottle",
    description: "Premium stainless steel water bottle with advanced insulation technology. Keeps drinks cold for 24 hours and hot for 12 hours. Perfect for outdoor adventures and daily use.",
    price: 49.99,
    originalPrice: 69.99,
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
    ],
    category: "water-bottles",
    inStock: true,
    stockQuantity: 100,
    rating: 4.8,
    numReviews: 156,
    features: [
      "24-hour cold retention",
      "12-hour hot retention",
      "Leak-proof design",
      "BPA-free materials",
      "Dishwasher safe"
    ],
    specifications: {
      capacity: "32oz (950ml)",
      material: "18/8 Stainless Steel",
      dimensions: "11.5\" x 3.5\" x 3.5\"",
      weight: "1.2 lbs",
      color: "Matte Black"
    },
    isFeatured: true,
    tags: ["bestseller", "premium", "insulated"]
  },
  {
    name: "GreenLife Bamboo Bottle",
    description: "Sustainable bamboo fiber water bottle with natural antimicrobial properties. Lightweight and eco-friendly alternative to plastic bottles.",
    price: 29.99,
    originalPrice: 39.99,
    images: [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
    ],
    category: "water-bottles",
    inStock: true,
    stockQuantity: 75,
    rating: 4.5,
    numReviews: 89,
    features: [
      "Bamboo fiber construction",
      "Natural antimicrobial",
      "Lightweight design",
      "Eco-friendly materials",
      "Easy to clean"
    ],
    specifications: {
      capacity: "20oz (600ml)",
      material: "Bamboo Fiber",
      dimensions: "9.5\" x 2.8\" x 2.8\"",
      weight: "0.8 lbs",
      color: "Natural Bamboo"
    },
    isFeatured: true,
    tags: ["eco-friendly", "bamboo", "lightweight"]
  },
  {
    name: "HydroMax Sports Bottle",
    description: "High-performance sports water bottle designed for athletes. Features a wide mouth for easy filling and a secure flip-top lid for quick access during workouts.",
    price: 24.99,
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
    ],
    category: "water-bottles",
    inStock: true,
    stockQuantity: 120,
    rating: 4.3,
    numReviews: 203,
    features: [
      "Wide mouth design",
      "Flip-top lid",
      "Non-slip grip",
      "Durable construction",
      "BPA-free"
    ],
    specifications: {
      capacity: "28oz (830ml)",
      material: "Tritan Plastic",
      dimensions: "10.5\" x 3.2\" x 3.2\"",
      weight: "0.6 lbs",
      color: "Blue"
    },
    isFeatured: false,
    tags: ["sports", "athletic", "durable"]
  },
  {
    name: "Bottle Cleaning Kit",
    description: "Complete cleaning kit for maintaining your water bottles. Includes brushes, cleaning tablets, and storage case.",
    price: 19.99,
    images: [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500"
    ],
    category: "accessories",
    inStock: true,
    stockQuantity: 50,
    rating: 4.6,
    numReviews: 67,
    features: [
      "Multiple brush sizes",
      "Cleaning tablets",
      "Storage case",
      "Long-lasting",
      "Easy to use"
    ],
    specifications: {
      capacity: "N/A",
      material: "Silicone & Plastic",
      dimensions: "8\" x 4\" x 2\"",
      weight: "0.3 lbs",
      color: "Multi-color"
    },
    isFeatured: false,
    tags: ["cleaning", "maintenance", "accessories"]
  },
  {
    name: "Eco Starter Pack",
    description: "Perfect starter pack for eco-conscious individuals. Includes our best-selling water bottle, cleaning kit, and reusable straws.",
    price: 79.99,
    originalPrice: 99.99,
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500"
    ],
    category: "gift-sets",
    inStock: true,
    stockQuantity: 25,
    rating: 4.9,
    numReviews: 34,
    features: [
      "Complete starter set",
      "Best value package",
      "Gift-ready packaging",
      "Eco-friendly materials",
      "Perfect for beginners"
    ],
    specifications: {
      capacity: "32oz + Accessories",
      material: "Stainless Steel + Accessories",
      dimensions: "12\" x 8\" x 6\"",
      weight: "2.1 lbs",
      color: "Gift Box"
    },
    isFeatured: true,
    tags: ["gift", "starter", "bundle", "value"]
  }
];

const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@ecobottle.com",
    password: "admin123",
    role: "admin"
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "user"
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    role: "user"
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eco-water-bottle');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Insert sample data
    await Product.insertMany(sampleProducts);
    await User.insertMany(sampleUsers);
    console.log('Inserted sample data');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
