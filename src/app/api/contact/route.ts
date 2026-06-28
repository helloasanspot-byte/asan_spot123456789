import { NextResponse } from 'next/server';
import { sendTelegramMessage } from '../../../lib/telegram';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'لطفاً تمام فیلدهای ضروری را پر کنید.' }, { status: 400 });
    }

    const textMessage = `
📬 *New Contact Message!* 📬

👤 *Name:* ${name}
📧 *Email:* ${email}
📝 *Subject:* ${subject || 'No Subject'}

💬 *Message:*
${message}
    `;

    try {
      await sendTelegramMessage(textMessage)
    } catch (err: any) {
      console.error('❌ Telegram Sending Error:', err)
      throw new Error('خطا در ارسال به تلگرام');
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully!' });

  } catch (error: any) {
    console.error('❌ Contact API Error:', error);
    return NextResponse.json({ error: 'ارور داخلی سرور' }, { status: 500 });
  }
}