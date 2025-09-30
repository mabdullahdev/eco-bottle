'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import axios from 'axios';
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  numReviews: number;
  inStock: boolean;
  stockQuantity: number;
  isFeatured: boolean;
  features: string[];
  specifications: {
    capacity: string;
    material: string;
    color: string;
  };
}

const ProductShowcase = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/products/featured');
        setProducts(response.data.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
        // Fallback to mock data
        setProducts([
          {
            _id: '1',
            name: 'EcoFlow Pro Water Bottle',
            description: 'Premium stainless steel water bottle with advanced insulation technology.',
            price: 49.99,
            originalPrice: 69.99,
            images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500'],
            rating: 4.8,
            numReviews: 156,
            inStock: true,
            stockQuantity: 100,
            isFeatured: true,
            features: ['24-hour cold retention', 'Leak-proof design'],
            specifications: {
              capacity: '32oz',
              material: 'Stainless Steel',
              color: 'Matte Black'
            }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section id="products" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="text-center mb-16"
        >
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Featured
            <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent"> Products</span>
          </h2>
          <p
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            Discover our most popular eco-friendly water bottles, carefully selected for their exceptional quality and environmental impact.
          </p>
        </div>

        {error && (
          <div
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8"
          >
            <p className="text-yellow-800">{error}</p>
          </div>
        )}

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {products.map((product) => (
            <motion.div
              key={product._id}
              whileHover={{ y: -10 }}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <Image
                  src={product.images[0] || 'https://images.unsplash.com/photo-1602143407151-7111542de6e8'}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isFeatured && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Sale
                    </span>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50"
                  >
                    <Heart className="w-5 h-5 text-gray-600" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50"
                  >
                    <Eye className="w-5 h-5 text-gray-600" />
                  </motion.button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  {product.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.numReviews} reviews)
                  </span>
                </div>

                {/* Specifications */}
                <div className="text-sm text-gray-500 mb-4">
                  <p><span className="font-medium">Capacity:</span> {product.specifications.capacity}</p>
                  <p><span className="font-medium">Material:</span> {product.specifications.material}</p>
                  <p><span className="font-medium">Color:</span> {product.specifications.color}</p>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    product.inStock 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!product.inStock}
                  className={`w-full py-3 rounded-full font-semibold flex items-center justify-center space-x-2 transition-all duration-300 ${
                    product.inStock
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Products Button */}
        <div
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white border-2 border-green-500 text-green-500 px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-500 hover:text-white transition-all duration-300"
          >
            View All Products
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
