import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { sendTelegramMessage } from '../../../../lib/telegram';

export async function POST(req: Request) {
  try {
    // ۱. دریافت هدر امضای امنیتی NowPayments
    const signature = req.headers.get('x-nowpayments-sig');
    if (!signature) {
      return NextResponse.json({ error: 'No signature provided' }, { status: 401 });
    }

    // ۲. خواندن بادی درخواست
    const bodyText = await req.text();
    const body = JSON.parse(bodyText);

    // ۳. اعتبارسنجی امنیتی (جلوگیری از هک شدن وب‌هوک)
    const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET as string;
    const hmac = crypto.createHmac('sha512', ipnSecret);
    
    // سورت کردن کلیدها (قانون امنیتی NowPayments)
    const sortedKeys = Object.keys(body).sort();
    const sortedBody = JSON.stringify(body, sortedKeys);
    
    hmac.update(sortedBody);
    const calculatedSignature = hmac.digest('hex');

    if (calculatedSignature !== signature) {
      console.error("❌ Crypto Webhook: Invalid Signature!");
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    // ۴. بررسی وضعیت پرداخت
    const acceptedStatuses = ['finished', 'completed', 'confirmed', 'success']
    if (acceptedStatuses.includes(String(body.payment_status).toLowerCase())) {
      const orderId = body.order_id || body.orderId

      if (!orderId) {
        return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
      }

      // ۵. اتصال به دیتابیس
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      const supabase = createClient(supabaseUrl, supabaseKey);

      // ۶. آپدیت سفارش به وضعیت پردازش خودکار
      const { error: updateError } = await supabase
        .from('smm_orders')
        .update({ status: 'processing' })
        .eq('id', orderId)

      if (updateError) {
        console.error('❌ Crypto Order Update Error:', updateError)
        return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 })
      }

      // ۷. دریافت جزئیات سفارش و کاربر برای تلگرام
      const { data: orderData, error: orderError } = await supabase
        .from('smm_orders')
        .select(`
          *,
          profiles(first_name, last_name),
          smm_services(name, supplier_service_id)
        `)
        .eq('id', orderId)
        .single()

      let userEmail = 'No email'
      let userPhone = 'No phone'
      let fullName = 'Customer'

      if (!orderError && orderData?.user_id) {
        const { data: authData } = await supabase.auth.admin.getUserById(orderData.user_id)
        userEmail = authData?.user?.email || 'No email'
        userPhone = authData?.user?.phone || 'No phone'
        fullName = `${orderData.profiles?.first_name || ''} ${orderData.profiles?.last_name || ''}`.trim() || 'Customer'
      }

      // ۸. ارسال پیام به تلگرام با جزئیات سفارش
      const message = `
🚀 *AUTOMATED CRYPTO PAYMENT VERIFIED!* 🚀

👤 *Customer:* ${fullName}
📧 *Email:* ${userEmail}
📱 *Phone:* ${userPhone}
🪙 *Coin Used:* ${String(body.pay_currency || 'crypto').toUpperCase()}
💰 *Amount Paid:* ${body.pay_amount || body.price_amount} ${String(body.pay_currency || 'crypto').toUpperCase()}
🛒 *Order ID:* \`${orderId}\`
📦 *Service:* ${orderData?.smm_services?.name || 'N/A'}
🔗 *Target Link:* ${orderData?.link || 'N/A'}
📊 *Quantity:* ${orderData?.quantity?.toLocaleString() || 'N/A'}
💵 *Total Cost:* $${Number(orderData?.total_cost || body.price_amount || 0).toFixed(3)}

✅ _Payment verified by blockchain. Order is now processing automatically._
      `;

      try {
        await sendTelegramMessage(message)
      } catch (err: any) {
        console.error('❌ Telegram Sending Error:', err)
      }

      console.log(`✅ Crypto Payment Verified for Order: ${orderId}`)
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('❌ Crypto Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}