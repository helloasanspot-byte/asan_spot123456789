import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    // ۱. استخراج اطلاعات از فرم
    const formData = await req.formData();
    const file = formData.get('receipt') as File;
    const orderId = formData.get('orderId') as string;
    const gateway = formData.get('gateway') as string; // این مقدار از فرم AtomaPay فرستاده می‌شود

    if (!file || !orderId) {
      return NextResponse.json({ error: 'اطلاعات ناقص است' }, { status: 400 });
    }

    // ۲. اتصال به دیتابیس با کلید Service Role (برای دسترسی کامل به استوریج و Auth)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // ۳. آپلود رسید در باکت receipts سوپابیس
    const fileExt = file.name.split('.').pop();
    const fileName = `${gateway.toLowerCase()}-${orderId}-${Date.now()}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('receipts')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: true
      });

    if (uploadError) {
      console.error("❌ Storage Upload Error:", uploadError);
      return NextResponse.json({ error: 'خطا در ذخیره رسید در سرور' }, { status: 500 });
    }

    // گرفتن لینک پابلیک عکس برای ارسال به تلگرام
    const { data: { publicUrl } } = supabase.storage
      .from('receipts')
      .getPublicUrl(fileName);

    // ۴. دریافت اطلاعات سفارش + نام کاربر و سرویس
    const { data: orderData, error: orderError } = await supabase
      .from('smm_orders')
      .select(`
        *,
        profiles (first_name, last_name),
        smm_services (name, supplier_service_id)
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !orderData) {
      console.error("❌ Database Fetch Error:", orderError);
      return NextResponse.json({ error: 'سفارش یافت نشد' }, { status: 404 });
    }

    // ۵. دریافت ایمیل و شماره تماس مستقیم از Auth (امن‌ترین روش)
    const { data: authData } = await supabase.auth.admin.getUserById(orderData.user_id);
    const userEmail = authData?.user?.email || 'بدون ایمیل';
    const userPhone = authData?.user?.phone || 'بدون شماره تماس';
    const fullName = `${orderData.profiles?.first_name || ''} ${orderData.profiles?.last_name || ''}`.trim() || 'کاربر ناشناس';

    // ۶. ساخت فاکتور بسیار شیک برای تلگرام
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    const caption = `
🚨 *New Manual Payment Received!* 🚨

👤 *Customer Details:*
• *Name:* ${fullName}
• *Email:* ${userEmail}
• *Phone:* ${userPhone}
• *User ID:* \`${orderData.user_id}\`

🛒 *Order Details:*
• *Service Name:* ${orderData.smm_services?.name || 'Custom SMM Node'}
• *Service ID:* \`${orderData.smm_services?.supplier_service_id || 'N/A'}\`
• *Target Link:* ${orderData.link || 'N/A'}
• *Quantity:* ${orderData.quantity?.toLocaleString()}
• *Total Cost:* $${Number(orderData.total_cost).toFixed(3)}
• *Payment Method:* ${gateway || 'AtomaPay'}

🌐 *Receipt Image:* [Click Here to View](${publicUrl})

⚠️ _Please verify the receipt to process the order._
    `;

    // ۷. ارسال لینک عکس و اطلاعات به ربات تلگرام
    const tgResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        photo: publicUrl,
        caption: caption,
        parse_mode: 'Markdown'
      }),
    });

    if (!tgResponse.ok) {
      console.error("❌ Telegram Rejection:", await tgResponse.text());
    }

    // ۸. تغییر وضعیت سفارش در دیتابیس به در انتظار تایید
    await supabase
      .from('smm_orders')
      .update({ 
        status: 'pending_verification'
      })
      .eq('id', orderId);

    console.log("✅ Success: AtomaPay details sent to Telegram!");
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('❌ Webhook Fatal Error:', error);
    return NextResponse.json({ error: 'ارور داخلی سرور' }, { status: 500 });
  }
}