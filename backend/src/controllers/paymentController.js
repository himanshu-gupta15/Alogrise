import Stripe from 'stripe';
import "dotenv/config";
import InterviewPack from '../models/interviewPack.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const createCheckoutSession = async (req, res) => {
  try {
    const { packId } = req.body;
    if (!packId) {
      return res.status(400).json({ error: 'Invalid pack id' });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'Stripe not configured on server' });
    }

    const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';

    const pack = await InterviewPack.findOne({ packId, isActive: true }).lean();
    if (!pack) {
      return res.status(404).json({ error: 'Interview pack not found' });
    }

    if (!pack.isPremium) {
      return res.status(400).json({ error: 'This pack is free. No payment required.' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: pack.currency || 'usd',
            product_data: { name: `${pack.company} ${pack.role} Pack` },
            unit_amount: pack.priceInCents || 0,
          },
          quantity: 1,
        },
      ],
      metadata: {
        packId,
        userId: req.result?._id?.toString() || 'guest',
      },
      // include the session id so frontend can confirm with backend
      success_url: `${frontend}/practice?checkout_success=1&pack=${packId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontend}/practice?checkout_canceled=1&pack=${packId}`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err?.message || err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

import Purchase from '../models/purchase.js';

const confirmCheckout = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'Missing sessionId' });

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'Stripe not configured on server' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['payment_intent'] });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const paid = session.payment_status === 'paid' || session.status === 'complete';

    const packId = session.metadata?.packId || 'unknown';
    const userId = session.metadata?.userId || req.result?._id?.toString();

    // Upsert purchase record
    const amount = (session.amount_total || (session.line_items?.data?.[0]?.amount_total)) || 0;
    const currency = session.currency || 'usd';

    const existing = await Purchase.findOne({ stripeSessionId: sessionId });
    if (existing) {
      existing.paid = paid;
      await existing.save();
      return res.status(200).json({ message: 'Purchase updated', purchase: existing });
    }

    if (!userId) return res.status(400).json({ error: 'No user associated with this session' });

    const purchase = await Purchase.create({
      userId,
      packId,
      stripeSessionId: sessionId,
      amount: session.amount_total || 0,
      currency: session.currency || 'usd',
      paid,
    });

    res.status(200).json({ message: 'Purchase confirmed', purchase });
  } catch (err) {
    console.error('confirmCheckout error:', err?.message || err);
    res.status(500).json({ error: 'Failed to confirm checkout' });
  }
};

export { createCheckoutSession, confirmCheckout };
