import { Request, Response } from 'express';
import axios from 'axios';
import { prisma } from '../prisma/client';
import { v4 as uuidv4 } from 'uuid';

// PAYSTACK base URL
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export const initiatePayment = async (req: Request, res: Response) => {
    try {
        const { email, amount, projectManagerId } = req.body;

        if (!amount || !projectManagerId) {
            return res.status(400).json({ message: 'Missing amount or projectManagerId' });
        }

        // Create unique reference (invoiceRef)
        const invoiceRef = uuidv4();

        // Create payment record in DB
        const payment = await prisma.payment.create({
            data: {
                amount: amount,
                reference: invoiceRef,
                payment_type: 'RESERVE_MEDIA',
                description: 'Reservation payment',
                project_manager: {
                    connect: { id: projectManagerId },
                },
            },
        });

        // Call Paystack to initialize payment
        const paystackResponse = await axios.post(
            `${PAYSTACK_BASE_URL}/transaction/initialize`,
            {
                email: email,
                amount: amount * 100,
                reference: invoiceRef,
                callback_url: 'http://localhost:2100/api/payment/callback',
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const paymentUrl = paystackResponse.data.data.authorization_url;

        return res.status(200).json({
            message: 'Payment initiated',
            payment,
            paymentUrl,
        });
    } catch (error: any) {
        console.error('Payment initiation error:', error.response?.data || error.message);
        return res.status(500).json({ message: 'Failed to initiate payment' });
    }
};

export const paystackWebhook = async (req: Request, res: Response) => {
    try {
        const event = req.body;

        if (event.event === 'charge.success') {
            const reference = event.data.reference;

            // Update payment in DB
            await prisma.payment.updateMany({
                where: { reference: reference },
                data: { description: 'Payment successful' },
            });

            // Update related orders to PAID
            await prisma.order.updateMany({
                where: {
                    project_manager_id: event.data.metadata?.projectManagerId,
                    order_type: 'RESERVED',
                },
                data: {
                    status: 'PAID',
                    order_type: 'PAID',
                },
            });

            return res.status(200).send('Payment processed');
        } else {
            return res.status(400).send('payment unsuccessful or not handled, retry-payment');
        }
    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(500).send('Server error');
    }
};
