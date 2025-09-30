import express from 'express';
import { body } from 'express-validator';
import { contactUs } from '../controllers/contactController';

const router = express.Router();

// @route   POST /api/contact
// @desc    Send contact form
// @access  Public
router.post('/', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('phone').isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits'),
  body('subject').trim().isLength({ min: 5 }).withMessage('Subject must be at least 5 characters'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
], contactUs);

export default router;
