import express from 'express';
import {
    getCartItems,
    reserveMedia,
    editCartItem,
    removeCartItem,
} from '../controllers/reservation.controller';

const router = express.Router();

router.get('/cart/:projectManagerId', getCartItems);

router.post('/reserve', reserveMedia);

router.put('/reservation/cart/:cartItemId', editCartItem);

router.delete('/reservation/cart/:cartItemId', removeCartItem);

export default router;
