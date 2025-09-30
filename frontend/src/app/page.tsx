'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import ProductShowcase from '@/components/ProductShowcase';
import ContactForm from '@/components/ContactForm';
import FeaturesSection from '@/components/FeaturesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';

export default function Home() {
  const [abTestVariant, setAbTestVariant] = useState<'A' | 'B'>('A');
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    // A/B Testing: Check URL params for variant
    const urlParams = new URLSearchParams(window.location.search);
    const variant = urlParams.get('variant') as 'A' | 'B';
    if (variant === 'A' || variant === 'B') {
      setAbTestVariant(variant);
    } else {
      // Randomly assign variant if not specified
      setAbTestVariant(Math.random() > 0.5 ? 'A' : 'B');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navigation />
      
      {/* Parallax Background */}
      <motion.div 
        className="fixed inset-0 -z-10"
        style={{ y }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-100/20 to-blue-100/20" />
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/30 rounded-full blur-xl" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-200/30 rounded-full blur-xl" />
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-emerald-200/30 rounded-full blur-xl" />
      </motion.div>

      <main>
        <HeroSection variant={abTestVariant} />
        <FeaturesSection />
        <ProductShowcase />
        <TestimonialsSection />
        <ContactForm />
      </main>

      <Footer />
    </div>
  );
}