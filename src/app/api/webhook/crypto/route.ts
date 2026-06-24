import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

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
    // status 'finished' یعنی پرداخت کاملاً در بلاک‌چین تایید شده است
    if (body.payment_status === 'finished' || body.payment_status === 'completed') {
      
      const orderId = body.order_id;

      // ۵. اتصال به دیتابیس
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      const supabase = createClient(supabaseUrl, supabaseKey);

      // ۶. آپدیت سفارش به وضعیت اتوماتیک (processing یا completed)
      await supabase
        .from('smm_orders')
        .update({ status: 'processing' }) // پردازش برای ارسال به فیم‌گروز
        .eq('id', orderId);

      // ۷. دریافت جزئیات سفارش برای تلگرام
      const { data: orderData } = await supabase
        .from('smm_orders')
        .select('*, profiles(first_name)')
        .eq('id', orderId)
        .single();

      // ۸. ارسال پیام به تلگرام شما
      const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
      const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

      const message = `
🚀 *AUTOMATED CRYPTO PAYMENT RECEIVED!* 🚀

👤 *User:* ${orderData?.profiles?.first_name || 'Customer'}
🪙 *Coin Used:* ${body.pay_currency.toUpperCase()}
💰 *Amount Paid:* ${body.pay_amount} ${body.pay_currency.toUpperCase()} (~$${body.price_amount})
🧾 *Order ID:* \`${orderId}\`

✅ _Payment verified by blockchain. Order is now processing automatically._
      `;

      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        }),
      });

      console.log(`✅ Crypto Payment Verified for Order: ${orderId}`);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('❌ Crypto Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}