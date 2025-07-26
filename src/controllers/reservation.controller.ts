import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

// Fetch cart items for a project manager
export const getCartItems = async (req: Request, res: Response) => {
    const projectManagerId = req.params.projectManagerId;
    try {
        const cartItems = await prisma.orderInCart.findMany({
            where: { project_manager_id: projectManagerId },
            include: { media: true },
        });
        if (cartItems.length === 0) {
            return res.status(404).json({ message: 'No items found in cart' });
        }

        // Calculate total price of items in the cart
        const total = cartItems.reduce((sum, item) => {
            return sum + (item.media?.booking_price || 0);
        }, 0);

        // Return cart items and total price
        res.status(200).json({
            message: 'Cart items fetched successfully',
            cartItems,
            total,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch cart items', error });
    }
};

//Generate invoice & create Order(s)
export const reserveMedia = async (req: Request, res: Response) => {
    const projectManagerId = req.body.projectManagerId;
    try {
        const cartItems = await prisma.orderInCart.findMany({
            where: { project_manager_id: projectManagerId },
        });

        // Create orders for each cart item
        const orders = await Promise.all(
            cartItems.map(async (item) => {
                return prisma.order.create({
                    data: {
                        media_id: item.media_id,
                        start_date: item.start_date,
                        expired_date: item.expired_date,
                        duration: item.duration as any,
                        duration_count: item.duration_count,
                        project_manager_id: projectManagerId,
                        status: 'RESERVED',
                        order_type: 'RESERVED',
                    },
                });
            })
        );

        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: 'Failed to reserve media', error });
    }
};

// Edit cart item
export const editCartItem = async (req: Request, res: Response) => {
    const { cartItemId } = req.params;
    const { duration, start_date, duration_count } = req.body;

    try {
        const updatedItem = await prisma.orderInCart.update({
            where: { id: cartItemId },
            data: {
                duration,
                start_date: new Date(start_date),
                duration_count,
            },
        });

        res.status(200).json({ message: 'Cart item updated', updatedItem });
    } catch (error) {
        console.error('Edit cart error:', error);
        res.status(500).json({ message: 'Failed to edit cart item' });
    }
};

// Remove cart item
export const removeCartItem = async (req: Request, res: Response) => {
    const { cartItemId } = req.params;

    try {
        await prisma.orderInCart.delete({
            where: { id: cartItemId },
        });

        res.status(200).json({ message: 'Cart item removed' });
    } catch (error) {
        console.error('Remove cart error:', error);
        res.status(500).json({ message: 'Failed to remove cart item' });
    }
};
