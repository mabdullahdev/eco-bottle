'use client';

import { motion, Variants } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Droplets, Shield, Leaf, Zap, Thermometer, Heart } from 'lucide-react';

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Droplets,
      title: "24-Hour Cold Retention",
      description: "Advanced double-wall insulation keeps your drinks ice-cold for up to 24 hours, perfect for long adventures.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Thermometer,
      title: "12-Hour Hot Retention",
      description: "Keep your coffee, tea, or soup piping hot for up to 12 hours with our premium thermal technology.",
      color: "from-red-500 to-orange-500"
    },
    {
      icon: Shield,
      title: "Leak-Proof Design",
      description: "Triple-sealed lid system ensures zero leaks, even when upside down. Perfect for active lifestyles.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Leaf,
      title: "100% Eco-Friendly",
      description: "Made from sustainable materials with zero plastic waste. Every purchase helps protect our planet.",
      color: "from-green-600 to-teal-500"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Quick-chill technology cools your drinks in minutes. No more waiting for ice to melt.",
      color: "from-yellow-500 to-amber-500"
    },
    {
      icon: Heart,
      title: "Health Safe",
      description: "BPA-free, phthalate-free, and toxin-free materials ensure your drinks stay pure and healthy.",
      color: "from-pink-500 to-rose-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants as Variants}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Why Choose Our
            <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent"> Eco Bottles?</span>
          </motion.h2>
          <motion.p
            variants={itemVariants as Variants}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            Experience the perfect combination of cutting-edge technology, sustainable materials, and exceptional design. 
            Our water bottles are engineered to exceed your expectations while protecting our planet.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants as Variants}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
              
              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg transition-shadow duration-300`}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-green-200 transition-colors duration-300" />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300"
          >
            Explore All Features
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
