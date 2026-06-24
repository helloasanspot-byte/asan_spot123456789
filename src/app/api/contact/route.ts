import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'لطفاً تمام فیلدهای ضروری را پر کنید.' }, { status: 400 });
    }

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error("❌ Telegram keys missing in .env.local");
      return NextResponse.json({ error: 'تنظیمات سرور ناقص است' }, { status: 500 });
    }

    // ساخت پیام متنی شیک برای تلگرام
    const textMessage = `
📬 *New Contact Message!* 📬

👤 *Name:* ${name}
📧 *Email:* ${email}
📝 *Subject:* ${subject || 'No Subject'}

💬 *Message:*
${message}
    `;

    // ارسال به ربات تلگرام
    const tgResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: textMessage,
        parse_mode: 'Markdown'
      }),
    });

    if (!tgResponse.ok) {
      console.error("❌ Telegram Rejection:", await tgResponse.text());
      throw new Error('خطا در ارسال به تلگرام');
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully!' });

  } catch (error: any) {
    console.error('❌ Contact API Error:', error);
    return NextResponse.json({ error: 'ارور داخلی سرور' }, { status: 500 });
  }
}