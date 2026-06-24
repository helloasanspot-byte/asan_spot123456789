import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    // ۱. دریافت اطلاعات ارسالی از فرانت‌اِند
    const body = await req.json()
    const { orderId } = body

    // ۲. اعتبارسنجی اولیه پارامترها
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required to initialize checkout node.' },
        { status: 400 }
      )
    }

    // ۳. تولید آدرس هدایت سفارشی به ترمینال تایید و آپلود رسید حساب‌پی
    const checkoutUrl = `/payment-confirm/hesabpay?orderId=${orderId}`

    // ۴. بازگرداندن پاسخ موفقیت‌آمیز به همراه لینک هدایت
    return NextResponse.json({
      success: true,
      message: 'HesabPay checkout route initialized successfully.',
      checkoutUrl: checkoutUrl
    })

  } catch (error: any) {
    console.error('⚠️ HesabPay Checkout Fatal Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal Server Error occurred during checkout initialization.' 
      },
      { status: 500 }
    )
  }
}