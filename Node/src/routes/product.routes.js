/**
 * Product Routes - E-commerce API
 */

const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// Public routes
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/:id', productController.getProduct);

// Protected routes
router.use(protect);

router.get('/seller/my', productController.getMyProducts);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Reviews
router.post('/:id/reviews', productController.addReview);
router.delete('/:id/reviews/:reviewId', productController.deleteReview);

module.exports = router;
