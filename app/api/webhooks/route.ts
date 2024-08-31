import { db } from "@/db"
import { stripe } from "@/lib/stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(req: Request) {

  try {
    const body = await req.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return new Response('Invalid signature', { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOKS_SECRET!)

    if (event.type === 'checkout.session.completed') {
      if (!event.data.object.customer_details?.email) {
        throw new Error("Missing user email")
      }

      const session = event.data.object as Stripe.Checkout.Session
      const { userId, orderId } = session.metadata || { userId: null, orderId: null }
      if (!userId || !orderId) {
        throw new Error('Invalid request matadata')
      }

      const billingAddress = session.customer_details!.address
      const ShippingAddress = session.shipping_details!.address

      await db.order.update({
        where: { id: orderId },
        data: {
          isPaid: true,
          shippingAddress: {
            create: {
              name: session.customer_details!.name!,
              city: ShippingAddress!.city!,
              country: ShippingAddress!.country!,
              postalCode: ShippingAddress!.postal_code!,
              street: ShippingAddress!.line1!,
              state: ShippingAddress!.state,
            }
          },
          billingAddress: {
            create: {
              name: session.customer_details!.name!,
              city: billingAddress!.city!,
              country: billingAddress!.country!,
              postalCode: billingAddress!.postal_code!,
              street: billingAddress!.line1!,
              state: billingAddress!.state,
            }
          }
        }
      })
    }

    return NextResponse.json({ result: event, ok: true })
  } catch (error) {
    console.error(error);

    NextResponse.json(
      {
        message: 'something went wrong',
        ok: false
      },
      {
        status: 500
      })
  }

}
