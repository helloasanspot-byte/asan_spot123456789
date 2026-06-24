import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { orderId, amountUSD, serviceName } = await req.json()

    if (!orderId || !amountUSD) {
      return NextResponse.json({ error: 'Order ID and Amount are required' }, { status: 400 })
    }

    const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY

    // درخواست ساخت فاکتور به سرور NowPayments
    const response = await fetch('https://api.nowpayments.io/v1/invoice', {
      method: 'POST',
      headers: {
        'x-api-key': NOWPAYMENTS_API_KEY as string,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_amount: amountUSD,
        price_currency: 'usd',
        order_id: orderId,
        order_description: serviceName || 'Asan Spot SMM Services',
        ipn_callback_url: 'https://asanspot.com/api/webhook/crypto', // وب‌هوک شما
        success_url: 'https://asanspot.com/dashboard/orders?payment=success',
        cancel_url: 'https://asanspot.com/dashboard/new-order?payment=cancelled',
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create crypto invoice')
    }

    // هدایت کاربر به لینک پرداخت کریپتو
    return NextResponse.json({
      success: true,
      checkoutUrl: data.invoice_url
    })

  } catch (error: any) {
    console.error('❌ Crypto Checkout Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}