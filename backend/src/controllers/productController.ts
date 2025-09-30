import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Product } from '../models/Product';
import { cache } from '../utils/redis';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string;
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as string || 'desc';

    const cacheKey = `products:${page}:${limit}:${category}:${sortBy}:${sortOrder}`;
    
    // Try to get from cache first
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      res.json(JSON.parse(cachedData));
      return;
    }

    // Build query
    const query: any = {};
    if (category) {
      query.category = category;
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ]);

    const result = {
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: products
    };

    // Cache for 5 minutes
    await cache.set(cacheKey, JSON.stringify(result), 300);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cacheKey = `product:${req.params.id}`;
    
    // Try to get from cache first
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      res.json(JSON.parse(cachedData));
      return;
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Product not found'
      });
      return;
    }

    const result = {
      success: true,
      data: product
    };

    // Cache for 10 minutes
    await cache.set(cacheKey, JSON.stringify(result), 600);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array()
      });
      return;
    }

    const product = await Product.create(req.body);

    // Clear related caches
    await cache.del('products:*');
    await cache.del('featured-products');

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Product not found'
      });
      return;
    }

    // Clear related caches
    await cache.del(`product:${req.params.id}`);
    await cache.del('products:*');
    await cache.del('featured-products');

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Product not found'
      });
      return;
    }

    // Clear related caches
    await cache.del(`product:${req.params.id}`);
    await cache.del('products:*');
    await cache.del('featured-products');

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cacheKey = 'featured-products';
    
    // Try to get from cache first
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      res.json(JSON.parse(cachedData));
      return;
    }

    const products = await Product.find({ isFeatured: true, inStock: true })
      .limit(8)
      .sort({ rating: -1 })
      .lean();

    const result = {
      success: true,
      count: products.length,
      data: products
    };

    // Cache for 15 minutes
    await cache.set(cacheKey, JSON.stringify(result), 900);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
export const searchProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { q, category, minPrice, maxPrice, sortBy = 'rating', sortOrder = 'desc' } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const cacheKey = `search:${q}:${category}:${minPrice}:${maxPrice}:${sortBy}:${sortOrder}:${page}:${limit}`;
    
    // Try to get from cache first
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      res.json(JSON.parse(cachedData));
      return;
    }

    // Build search query
    const query: any = { inStock: true };

    if (q) {
      query.$text = { $search: q as string };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice as string);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice as string);
    }

    // Build sort object
    const sort: any = {};
    if (q) {
      sort.score = { $meta: 'textScore' };
    }
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ]);

    const result = {
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      query: { q, category, minPrice, maxPrice },
      data: products
    };

    // Cache for 5 minutes
    await cache.set(cacheKey, JSON.stringify(result), 300);

    res.json(result);
  } catch (error) {
    next(error);
  }
};
