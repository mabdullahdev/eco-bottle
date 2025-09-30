import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

// @desc    Send contact form
// @route   POST /api/contact
// @access  Public
export const contactUs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array()
      });
      return;
    }

    const { name, email, phone, subject, message, newsletter } = req.body;

    // In a real application, you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Add to newsletter if requested
    // 4. Send auto-reply to user

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Log the contact form submission (in production, save to database)
    console.log('Contact form submission:', {
      name,
      email,
      phone,
      subject,
      message,
      newsletter,
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you within 24 hours.',
      data: {
        id: Date.now(), // Simulate contact ID
        name,
        email,
        subject,
        submittedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};
